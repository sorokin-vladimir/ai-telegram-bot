const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

export const convertMarkdownToHtml = (markdown: string): string => {
  const codeBlocks: string[] = [];
  const inlineCodes: string[] = [];

  // Step 1: Protect code blocks
  let text = markdown.replace(/```([\s\S]*?)```/g, (_, code) => {
    codeBlocks.push(code);
    return `___CODE_BLOCK_${codeBlocks.length - 1}___`;
  });

  // Step 2: Protect inline code
  text = text.replace(/`([^`]+)`/g, (_, code) => {
    inlineCodes.push(code);
    return `___INLINE_CODE_${inlineCodes.length - 1}___`;
  });

  // Step 3: Convert numbered lists to bullet lists
  text = text.replace(/^\d+\.\s+/gm, '• ');

  // Step 4: Escape HTML characters in remaining text
  text = escapeHtml(text);

  // Step 5: Convert headers to bold
  text = text.replace(/^#{1,6}\s+(.+)$/gm, '<b>$1</b>');

  // Step 5: Convert bold (**text** or __text__)
  text = text.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  text = text.replace(/__(.+?)__/g, '<b>$1</b>');

  // Step 6: Convert italic (*text* or _text_)
  text = text.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<i>$1</i>');
  text = text.replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, '<i>$1</i>');

  // Step 7: Convert strikethrough (~~text~~)
  text = text.replace(/~~(.+?)~~/g, '<s>$1</s>');

  // Step 8: Restore code blocks
  text = text.replace(/___CODE_BLOCK_(\d+)___/g, (_, index) => {
    return `<pre>${escapeHtml(codeBlocks[parseInt(index)])}</pre>`;
  });

  // Step 9: Restore inline code
  text = text.replace(/___INLINE_CODE_(\d+)___/g, (_, index) => {
    return `<code>${escapeHtml(inlineCodes[parseInt(index)])}</code>`;
  });

  return text;
};

const TELEGRAM_MAX_MESSAGE_LENGTH = 4096;

export const splitLongMessage = (text: string, maxLength: number = TELEGRAM_MAX_MESSAGE_LENGTH): string[] => {
  if (text.length <= maxLength) {
    return [text];
  }

  const chunks: string[] = [];
  let remainingText = text;

  while (remainingText.length > 0) {
    if (remainingText.length <= maxLength) {
      chunks.push(remainingText);
      break;
    }

    // Try to find a good split point (newline, space, or punctuation)
    let splitIndex = maxLength;

    // Look for newline within the last 500 characters of the chunk
    const searchStart = Math.max(0, maxLength - 500);
    const lastNewline = remainingText.lastIndexOf('\n', maxLength);
    if (lastNewline > searchStart) {
      splitIndex = lastNewline + 1;
    } else {
      // Look for space within the last 200 characters
      const lastSpace = remainingText.lastIndexOf(' ', maxLength);
      if (lastSpace > maxLength - 200) {
        splitIndex = lastSpace + 1;
      }
    }

    chunks.push(remainingText.slice(0, splitIndex));
    remainingText = remainingText.slice(splitIndex);
  }

  return chunks;
};
