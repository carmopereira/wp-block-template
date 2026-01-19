const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const pkgPath = path.join(root, 'package.json');

if (!fs.existsSync(pkgPath)) {
	console.error('❌ package.json não encontrado!');
	process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const version = pkg.version;
const pluginName = pkg.name;

// Encontrar ficheiro PHP principal
// Tenta primeiro {plugin-name}.php, depois procura qualquer .php na raiz
let pluginPath = null;
const possiblePhpNames = [
	`${pluginName}.php`,
	`${pluginName.replace(/[^a-z0-9]/gi, '-')}.php`,
];

// Procurar ficheiro PHP na raiz
const rootFiles = fs.readdirSync(root);
for (const file of rootFiles) {
	if (file.endsWith('.php') && !file.startsWith('.')) {
		// Verificar se é o ficheiro principal (contém "Plugin Name:")
		const content = fs.readFileSync(path.join(root, file), 'utf8');
		if (content.includes('Plugin Name:')) {
			pluginPath = path.join(root, file);
			break;
		}
	}
}

if (!pluginPath) {
	console.error('❌ Ficheiro PHP principal não encontrado!');
	process.exit(1);
}

// Encontrar block.json recursivamente em src/
function findBlockJson(dir) {
	if (!fs.existsSync(dir)) {
		return null;
	}
	
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			const found = findBlockJson(fullPath);
			if (found) return found;
		} else if (entry.name === 'block.json') {
			return fullPath;
		}
	}
	return null;
}

const blockJsonPath = findBlockJson(path.join(root, 'src'));

if (!blockJsonPath) {
	console.warn('⚠️  block.json não encontrado em src/. Continuando sem atualizar...');
}

const updateFile = (filePath, updater) => {
	if (!fs.existsSync(filePath)) {
		return;
	}
	const contents = fs.readFileSync(filePath, 'utf8');
	const next = updater(contents);
	if (next !== contents) {
		fs.writeFileSync(filePath, next, 'utf8');
		console.log(`✅ Versão atualizada em ${path.relative(root, filePath)}`);
	}
};

// Atualizar ficheiro PHP
updateFile(pluginPath, (contents) => {
	return contents.replace(
		/^\s*\*\s*Version:\s*.*$/m,
		` * Version:           ${version}`
	);
});

// Atualizar block.json se encontrado
if (blockJsonPath) {
	updateFile(blockJsonPath, (contents) => {
		return contents.replace(
			/"version"\s*:\s*"[^"]*"/,
			`"version": "${version}"`
		);
	});
}

console.log(`✅ Versão sincronizada: ${version}`);
