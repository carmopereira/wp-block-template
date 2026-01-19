#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function question(query) {
	return new Promise((resolve) => rl.question(query, resolve));
}

// Obter diretório do pacote npm (onde está este ficheiro)
const packageDir = __dirname;
const setupsDir = path.join(packageDir, 'setups');

// Listar setups disponíveis
function getAvailableSetups() {
	if (!fs.existsSync(setupsDir)) {
		return [];
	}
	return fs
		.readdirSync(setupsDir, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);
}

// Obter diretório do projeto atual (onde será aplicado o setup)
const projectDir = process.cwd();
const projectPackageJson = path.join(projectDir, 'package.json');

// Verificar se estamos num projeto válido
if (!fs.existsSync(projectPackageJson)) {
	console.error('❌ package.json não encontrado!');
	console.error('   Certifica-te de que estás no diretório do projeto.');
	process.exit(1);
}

// Ler package.json do projeto
let projectPackage;
try {
	projectPackage = JSON.parse(fs.readFileSync(projectPackageJson, 'utf8'));
} catch (error) {
	console.error('❌ Erro ao ler package.json:', error.message);
	process.exit(1);
}

const pluginName = projectPackage.name;

async function main() {
	console.log('\n🚀 Carmo WP Block Setup\n');
	console.log(`Plugin: ${pluginName}`);
	console.log(`Diretório: ${projectDir}\n`);

	// Obter setup a aplicar
	const availableSetups = getAvailableSetups();
	if (availableSetups.length === 0) {
		console.error('❌ Nenhum setup encontrado em setups/');
		process.exit(1);
	}

	let setupName = process.argv[2];

	// Se não foi fornecido argumento, perguntar interativamente
	if (!setupName || !availableSetups.includes(setupName)) {
		if (availableSetups.length === 1) {
			setupName = availableSetups[0];
			console.log(`📦 Usando setup: ${setupName}\n`);
		} else {
			console.log('Setups disponíveis:');
			availableSetups.forEach((setup, index) => {
				console.log(`  ${index + 1}. ${setup}`);
			});
			const answer = await question('\nEscolhe o setup (número ou nome): ');
			const num = parseInt(answer, 10);
			if (!isNaN(num) && num > 0 && num <= availableSetups.length) {
				setupName = availableSetups[num - 1];
			} else if (availableSetups.includes(answer.trim())) {
				setupName = answer.trim();
			} else {
				console.error('❌ Setup inválido!');
				rl.close();
				process.exit(1);
			}
		}
	}

	const setupDir = path.join(setupsDir, setupName);
	if (!fs.existsSync(setupDir)) {
		console.error(`❌ Setup "${setupName}" não encontrado!`);
		rl.close();
		process.exit(1);
	}

	console.log(`📦 Aplicando setup: ${setupName}\n`);

	// 1. Adicionar scripts ao package.json
	const packageScriptsPath = path.join(setupDir, 'package-scripts.json');
	if (fs.existsSync(packageScriptsPath)) {
		const packageScripts = JSON.parse(
			fs.readFileSync(packageScriptsPath, 'utf8')
		);
		if (!projectPackage.scripts) {
			projectPackage.scripts = {};
		}
		Object.assign(projectPackage.scripts, packageScripts);
		fs.writeFileSync(
			projectPackageJson,
			JSON.stringify(projectPackage, null, '\t') + '\n',
			'utf8'
		);
		console.log('✅ Scripts adicionados ao package.json');
	}

	// 2. Copiar scripts
	const setupScriptsDir = path.join(setupDir, 'scripts');
	const projectScriptsDir = path.join(projectDir, 'scripts');

	if (fs.existsSync(setupScriptsDir)) {
		// Criar pasta scripts se não existir
		if (!fs.existsSync(projectScriptsDir)) {
			fs.mkdirSync(projectScriptsDir, { recursive: true });
		}

		const scripts = fs.readdirSync(setupScriptsDir);
		for (const script of scripts) {
			const srcPath = path.join(setupScriptsDir, script);
			const destPath = path.join(projectScriptsDir, script);
			fs.copyFileSync(srcPath, destPath);
			// Tornar executável se for .js
			if (script.endsWith('.js')) {
				fs.chmodSync(destPath, '755');
			}
			console.log(`✅ Script copiado: ${script}`);
		}
	}

	// 3. Atualizar .gitignore
	const setupGitignorePath = path.join(setupDir, '.gitignore');
	const projectGitignorePath = path.join(projectDir, '.gitignore');

	if (fs.existsSync(setupGitignorePath)) {
		const setupGitignore = fs.readFileSync(setupGitignorePath, 'utf8');
		let projectGitignore = '';

		if (fs.existsSync(projectGitignorePath)) {
			projectGitignore = fs.readFileSync(projectGitignorePath, 'utf8');
		}

		// Adicionar entradas do setup que não existem no projeto
		const setupLines = setupGitignore
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line && !line.startsWith('#'));

		const projectLines = projectGitignore.split('\n').map((line) => line.trim());

		let added = false;
		for (const line of setupLines) {
			if (!projectLines.includes(line)) {
				if (!added) {
					projectGitignore += '\n# Added by @carmopereira/wp-block-setup\n';
					added = true;
				}
				projectGitignore += line + '\n';
			}
		}

		if (added) {
			fs.writeFileSync(projectGitignorePath, projectGitignore, 'utf8');
			console.log('✅ .gitignore atualizado');
		}
	}

	console.log('\n✅ Setup aplicado com sucesso!\n');
	console.log('Próximos passos:');
	console.log('  - Executa "npm install" se necessário');
	console.log('  - Usa "npm run symlink" para criar symlink do plugin');
	console.log('  - Usa "npm run updateGIT" para fazer commit/push\n');

	rl.close();
}

main().catch((error) => {
	console.error('\n❌ Erro:', error.message);
	rl.close();
	process.exit(1);
});
