import {AuthData} from "@/types";

export function getSetupUrl(user: AuthData): string {
    if (!user.isEmailVerified)
        return '/verify-email/'
    switch (user.setupProgress) {
        case 0:
            return 'setup/connect-accounts/'
        case 1:
            return 'setup/event-calendar/'
        case 2:
            return 'setup/conflict-calendars/'
        case 3:
            return 'setup/availability/'
        default:
            return '/';
    }
}