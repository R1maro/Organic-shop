'use client';
import {useRouter} from 'next/navigation';

export default function GroupSelector({groups, defaultValue = '', search = ''}: {
    groups: string[];
    defaultValue?: string;
    search?: string;
}) {
    const router = useRouter();

    const handleGroupChange = (group: string) => {
        const params = new URLSearchParams();
        if (group) {
            params.append('group', group);
        }
        if (search) {
            params.append('search', search);
        }
        params.append('page', '1');

        router.push(`/dashboard/settings?${params.toString()}`);
    };

    return (
            <select
                className="rounded-md border border-stroke px-4 py-4 focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4"
                value={defaultValue}
                onChange={(e) => handleGroupChange(e.target.value)}
                aria-label="group"
            >
                <option value="">All Groups</option>
                {groups.map((groupName) => (
                    <option key={groupName} value={groupName}>
                        {groupName}
                    </option>
                ))}
            </select>
    );
}