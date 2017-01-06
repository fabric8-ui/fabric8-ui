import { Email } from './email';

export class Profile {
    fullName: string;
    imageURL: string;
    bio?: string;
    username?: string;
    url?: string;
    emails?: Email[];
    primaryEmail?: Email;
    emailPreference?: string;
    notificationMethods?: string[];
}
