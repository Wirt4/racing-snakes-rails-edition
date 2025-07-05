// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import("eslint").FlatConfig[]} */
export default [
	{
		ignores: ['build/**'], // 👈 Ignore compiled files (add more if needed)
	},
	...tseslint.config(
		eslint.configs.recommended,
		tseslint.configs.strict,
	),
];

// export default tseslint.config(
// 	eslint.configs.recommended,
// 	tseslint.configs.strict,
// );
