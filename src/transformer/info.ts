import type { Timerow } from "../parser/index.js";

export type InfoTransformer = (info: Timerow["info"]) => { summary: string; description: string };

export const transformInfoBasic: InfoTransformer = (info) => {
	return { summary: info.name, description: descript(info) };
};

function descript({ course, group, tuition, credits }: Timerow["info"]) {
	const description = [
		`Mã môn học: ${course}`,
		`Nhóm: ${group}`,
		`Số tín chỉ: ${credits}`,
		`Học phí: ${tuition} chỉ`,
	].join("\n");

	return description;
}
