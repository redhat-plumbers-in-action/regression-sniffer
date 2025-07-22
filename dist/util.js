export function getFailedMessage(error, setFailedHeader = true) {
    if (error.length === 0) {
        return '';
    }
    let header = '';
    if (setFailedHeader) {
        header = '#### Failed\n\n';
    }
    return header + error.join('\n');
}
export function getSuccessMessage(message) {
    if (message.length === 0) {
        return '';
    }
    return '#### Success' + '\n\n' + message.join('\n');
}
export function createMetadata(metadata) {
    return `<!-- regression-sniffer = ${JSON.stringify(metadata)} -->`;
}
//# sourceMappingURL=util.js.map