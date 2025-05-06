function maskEmail(email: string) {
    const [local, domain] = email.split("@");
    if (local.length <= 3) {
        return "*".repeat(local.length) + "@" + domain;
    }
    const visiblePart = local.slice(0, 3);
    const maskedPart = "*".repeat(4);
    return `${visiblePart}${maskedPart}@${domain}`;
}

export {
    maskEmail
};