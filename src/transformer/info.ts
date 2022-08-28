import type { Timerow } from "../parser/index.js";

export function transformInfoBasic({ course, name, group, tuition, credits }: Timerow["info"]): {
	summary: string;
	description: string;
} {
	const description = [
		`Mã môn học: ${course}`,
		`Nhóm: ${group}`,
		`Số tín chỉ: ${credits}`,
		`Học phí: ${tuition} chỉ`,
	].join("\n");
	const summary = name;

	return { description, summary };
}
