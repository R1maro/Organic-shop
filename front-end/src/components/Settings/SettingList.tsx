import { getSettingGroups } from '@/utils/dashboard/setting';
import SettingsGroupsView from './SettingsGroupsView';

export default async function SettingsList({
                                               search,
                                           }: {
    search?: string;
}) {
    // Only fetch the groups for the main settings page
    const groups = await getSettingGroups();

    return <SettingsGroupsView groups={groups} search={search} />;
}