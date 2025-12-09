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
import Chevron_Up_Linear from './Linear/Arrows/ChevronUp.svelte';
import Chevron_Down_Linear from './Linear/Arrows/ChevronDown.svelte';
import Chevron_Left_Linear from './Linear/Arrows/ChevronLeft.svelte';
import Chevron_Right_Linear from './Linear/Arrows/ChevronRight.svelte';
import Star_Linear from './Linear/Basic/Star.svelte';
import Play_Linear from './Linear/Audiovisual/Play.svelte';
import Calendar_Linear from './Linear/Time/Calendar.svelte';
import Tv_Linear from './Linear/Audiovisual/TV.svelte';
import Clock_Linear from './Linear/Time/Clock.svelte';
import User_Linear from './Linear/Users/User.svelte';
import Bell_Linear from './Linear/Alerts/Bell.svelte';
import Heart_Linear from './Linear/Basic/Heart.svelte';
import Lock_Linear from './Linear/Security/Lock.svelte';
// Filled
import Server_Filled from './Filled/Security/Server.svelte';
import Star_Filled from './Filled/Basic/Star.svelte';
import Play_Filled from './Filled/Audiovisual/Play.svelte';
import Eye_Filled from './Filled/Security/Eye.svelte';
import Lock_Filled from './Filled/Security/Lock.svelte';
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
		ChevronUp: Chevron_Up_Linear,
		ChevronDown: Chevron_Down_Linear,
		ChevronLeft: Chevron_Left_Linear,
		ChevronRight: Chevron_Right_Linear,
		Star: Star_Linear,
		Play: Play_Linear,
		Calendar: Calendar_Linear,
		Tv: Tv_Linear,
		Clock: Clock_Linear,
		User: User_Linear,
		Bell: Bell_Linear,
		Heart: Heart_Linear,
		Lock: Lock_Linear,
	},
	Duotone: {
		Info: Info_Duotone,
	},
	Filled: {
		Server: Server_Filled,
		Star: Star_Filled,
		Play: Play_Filled,
		Eye: Eye_Filled,
		Lock: Lock_Filled,
	},
	Fa: {
		CameraMovie: CameraMovie_Fa,
		Subtitles: Subtitles_Fa,
	},
} as const;

export type IconLinearName = keyof typeof Icon.Linear;
export type IconFilledName = keyof typeof Icon.Filled;
