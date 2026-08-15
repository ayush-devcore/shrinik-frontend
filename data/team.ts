export interface TeamMember {
    id: string;
    name: string;
    role: string;
    department: string;
    image: string;
    linkedin?: string;
}

export const teamMembers: TeamMember[] = [];