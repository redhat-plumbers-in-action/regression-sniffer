export function getFailedMessage(
  error: string[],
  setFailedHeader = true
): string {
  if (error.length === 0) {
    return '';
  }

  let header = '';
  if (setFailedHeader) {
    header = '#### Failed\n\n';
  }

  return header + error.join('\n');
}

export function getSuccessMessage(message: string[]): string {
  if (message.length === 0) {
    return '';
  }

  return '#### Success' + '\n\n' + message.join('\n');
}

export function createMetadata(metadata: string[]): string {
  return `<!-- regression-sniffer = ${JSON.stringify(metadata)} -->`;
}
