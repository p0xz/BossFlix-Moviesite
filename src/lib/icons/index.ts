import Info_Duotone from './Duotone/Alerts/Info.svelte';
import Info_Linear from './Linear/Alerts/Info.svelte';
import ArrowUp_Linear from './Linear/Arrows/ArrowTop.svelte';
import FilmTape_Linear from './Linear/Audiovisual/FilmTape.svelte';
import TV_Linear from './Linear/Audiovisual/TV.svelte';
import Gear_Linear from './Linear/Basic/Gear.svelte';
import Eye_Linear from './Linear/Security/Eye.svelte';
import Camera_Linear from './Linear/Images/Camera.svelte';
import Server_Linear from './Linear/Security/Server.svelte';
import Check_Linear from './Linear/Basic/Check.svelte';
import Slash_Linear from './Linear/Basic/Slash.svelte';
import Search_Linear from './Linear/Basic/Search.svelte';
import Trash_Linear from './Linear/Basic/Trash.svelte';
// Filled
import Server_Filled from './Filled/Security/Server.svelte';
// FA
import CameraMovie_Fa from './Fa/CameraMovie.svelte';
import Subtitles_Fa from './Fa/ClosedCaptioning.svelte';

export const Icon = {
	Linear: {
		FilmTape: FilmTape_Linear,
		Info: Info_Linear,
		ArrowUp: ArrowUp_Linear,
		TV: TV_Linear,
		Gear: Gear_Linear,
		Eye: Eye_Linear,
		Camera: Camera_Linear,
		Server: Server_Linear,
		Check: Check_Linear,
		Slash: Slash_Linear,
		Search: Search_Linear,
		Trash: Trash_Linear,
	},
	Duotone: {
		Info: Info_Duotone,
	},
	Filled: {
		Server: Server_Filled,
	},
	Fa: {
		CameraMovie: CameraMovie_Fa,
		Subtitles: Subtitles_Fa,
	},
} as const;

export type IconLinearName = keyof typeof Icon.Linear;
export type IconFilledName = keyof typeof Icon.Filled;
