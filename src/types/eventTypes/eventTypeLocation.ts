export type EventTypeLocation = {
    id: string;
    locationType: 'in-person' | 'call';
    isDefault: boolean;
    address?: string;
    requireInviteeNumber?: string;
    phoneNumber?: string
}