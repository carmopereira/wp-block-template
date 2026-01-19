const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const run = (cmd) => execSync(cmd, { stdio: 'inherit' });

const getStatus = () => execSync('git status --porcelain').toString().trim();

rl.question('Mensagem do commit: ', (message) => {
	const msg = (message || '').trim();
	if (!msg) {
		console.error('Erro: mensagem vazia.');
		rl.close();
		process.exit(1);
	}

	run('git status -sb');
	run('git diff --stat');

	const status = getStatus();
	if (!status) {
		console.log('Sem alterações para commit.');
		rl.close();
		process.exit(0);
	}

	rl.question('Continuar com add/commit/push? (s/N): ', (answer) => {
		const normalized = (answer || '').trim().toLowerCase();
		if (normalized !== 's' && normalized !== 'sim') {
			console.log('Operação cancelada.');
			rl.close();
			process.exit(0);
		}

		run('git add .');
		run(`git commit -m "${msg.replace(/"/g, '\\"')}"`);
		run('git push');

		rl.close();
	});
});
