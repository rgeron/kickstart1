"use client";

import { useState, useCallback, useEffect } from "react";
import { getMockMentionSuggestions, type MentionSuggestion } from "../queries/mention-suggestions.query";

interface UseMentionsOptions {
  onMentionAdd?: (mention: MentionSuggestion) => void;
  debounceMs?: number;
  maxSuggestions?: number;
}

interface MentionContext {
  query: string;
  startIndex: number;
  endIndex: number;
}

export function useMentions({
  onMentionAdd,
  debounceMs = 300,
  maxSuggestions = 10,
}: UseMentionsOptions = {}) {
  const [suggestions, setSuggestions] = useState<MentionSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentMention, setCurrentMention] = useState<MentionContext | null>(null);

  // Debounced search function
  const searchSuggestions = useCallback(
    async (query: string) => {
      if (query.length < 1) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      try {
        // For now, use mock data. In production, this would call the server action
        const results = getMockMentionSuggestions(query, maxSuggestions);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
        setSelectedIndex(0);
      } catch (error) {
        console.error('Error fetching mention suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    },
    [maxSuggestions]
  );

  // Debounce the search
  useEffect(() => {
    if (!currentMention) return;

    const timeoutId = setTimeout(() => {
      searchSuggestions(currentMention.query);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [currentMention, searchSuggestions, debounceMs]);

  // Extract mention from text at cursor position
  const extractMention = useCallback((text: string, cursorPosition: number): MentionContext | null => {
    // Find the @ symbol before the cursor
    let atIndex = -1;
    for (let i = cursorPosition - 1; i >= 0; i--) {
      if (text[i] === '@') {
        atIndex = i;
        break;
      }
      // Stop if we hit a space or newline
      if (text[i] === ' ' || text[i] === '\n') {
        break;
      }
    }

    if (atIndex === -1) return null;

    // Find the end of the mention
    let endIndex = cursorPosition;
    for (let i = atIndex + 1; i < text.length; i++) {
      if (text[i] === ' ' || text[i] === '\n' || text[i] === '@') {
        endIndex = i;
        break;
      }
      if (i === text.length - 1) {
        endIndex = text.length;
      }
    }

    const query = text.substring(atIndex + 1, endIndex);
    
    return {
      query,
      startIndex: atIndex,
      endIndex,
    };
  }, []);

  // Handle text change and cursor position
  const handleTextChange = useCallback((text: string, cursorPosition: number) => {
    const mention = extractMention(text, cursorPosition);
    setCurrentMention(mention);
    
    if (!mention) {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, [extractMention]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => (prev + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
        break;
      case 'Enter':
      case 'Tab':
        event.preventDefault();
        if (suggestions[selectedIndex]) {
          selectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        setShowSuggestions(false);
        break;
    }
  }, [showSuggestions, suggestions, selectedIndex]);

  // Select a suggestion
  const selectSuggestion = useCallback((suggestion: MentionSuggestion) => {
    if (!currentMention) return null;

    const mentionText = `@${suggestion.name}`;
    
    setShowSuggestions(false);
    setSuggestions([]);
    setCurrentMention(null);
    
    onMentionAdd?.(suggestion);

    return {
      mentionText,
      startIndex: currentMention.startIndex,
      endIndex: currentMention.endIndex,
    };
  }, [currentMention, onMentionAdd]);

  // Replace mention in text
  const replaceMentionInText = useCallback((
    text: string,
    startIndex: number,
    endIndex: number,
    mentionText: string
  ): { newText: string; newCursorPosition: number } => {
    const before = text.substring(0, startIndex);
    const after = text.substring(endIndex);
    const newText = before + mentionText + ' ' + after;
    const newCursorPosition = startIndex + mentionText.length + 1;

    return { newText, newCursorPosition };
  }, []);

  // Close suggestions
  const closeSuggestions = useCallback(() => {
    setShowSuggestions(false);
    setSuggestions([]);
    setCurrentMention(null);
  }, []);

  return {
    // State
    suggestions,
    isLoading,
    showSuggestions,
    selectedIndex,
    currentMention,
    
    // Actions
    handleTextChange,
    handleKeyDown,
    selectSuggestion,
    replaceMentionInText,
    closeSuggestions,
    
    // Utilities
    extractMention,
  };
}

// Utility function to parse mentions from text
export function parseMentions(text: string): Array<{
  mention: string;
  startIndex: number;
  endIndex: number;
}> {
  const mentions: Array<{
    mention: string;
    startIndex: number;
    endIndex: number;
  }> = [];
  
  const mentionRegex = /@(\w+)/g;
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push({
      mention: match[1],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    });
  }
  
  return mentions;
}

// Utility function to render mentions as HTML
export function renderMentionsAsHTML(text: string): string {
  return text.replace(/@(\w+)/g, (match, username) => {
    return `<span class="mention" data-mention="${username}">${match}</span>`;
  });
}

// Utility function to extract unique mentions from text
export function extractUniqueMentions(text: string): string[] {
  const mentions = parseMentions(text);
  const uniqueMentions = new Set(mentions.map(m => m.mention));
  return Array.from(uniqueMentions);
}
