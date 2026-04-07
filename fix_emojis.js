const fs = require('fs');
const path = require('path');

const emojiMap = {
    'fleche': '➡️',
    '3770_this_animated_right': '➡️',
    'sageata': '➡️',
    'online_il': '🟢',
    'online2': '🟢',
    'charliewave_dnd': '🔴',
    'charliewave_idle': '🟡',
    'charliewave_offline': '⚫',
    'away2': '🟡',
    'Banhammer': '🔨',
    'Support': '🆘',
    'channel': '💬',
    'channels': '💬',
    'voc': '🔊',
    'folder': '📁',
    'roles': '👑',
    'role': '🏷️',
    'invite_oeople': '👥',
    'server': '🏠',
    'music': '🎵',
    'coinsoneforall': '💰',
    'give': '🎉',
    'desc2': '📋',
    'title': '📝',
    'asked': '❓',
    'time': '⏰',
    'rate': '⭐',
    'cateogry': '📂',
    'like': '👍',
    'dislike': '👎',
    'image0': '🖼️',
    'image2': '🖼️',
    'reupload': '🔄',
    'verified': '✅',
    'verifiedbot': '🤖',
    'dev': '👨‍💻',
    'earlysupporter': '💎',
    'Z_Partenaire2': '🤝',
    'XDM_BugHunter': '🐛',
    'XDM_Staff': '⚙️',
    'YLM_Hypesquad': '🏠',
    'YLM_Shield': '🛡️',
    'level2bug': '🐛',
    'bravery': '💜',
    'briliance': '🧡',
    'balance': '💚',
    'mutecasque': '🔇',
    'mutemic': '🔇',
    'unmute': '🔈',
    'stream': '📺',
    'color': '🎨',
    '2366_Loading_Pixels': '⏳',
    'dboatsSharkDance': '🦈',
    'store_tag': '🏪',
};

const idFallbacks = {
    '778353230484471819': '📌',
    '778353230559969320': '🛡️',
    '778353230589460530': '⚔️',
    '778348494712340561': '✅',
    '778348495157329930': '❌',
    '778353230383546419': '📋',
    '775305392787685378': '👤',
    '771637500967124994': '🌐',
    '771462923855069204': '🔗',
    '720681441670725645': '▫️',
    '720681705219817534': '▫️',
};

function getReplacementEmoji(name, id) {
    if (emojiMap[name]) return emojiMap[name];
    if (idFallbacks[id]) return idFallbacks[id];
    return '▫️';
}

function getAllJsFiles(dir) {
    let results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === 'node_modules' || entry.name === 'docs') continue;
            results = results.concat(getAllJsFiles(fullPath));
        } else if (entry.name.endsWith('.js')) {
            results.push(fullPath);
        }
    }
    return results;
}

const rootDir = __dirname;
const files = getAllJsFiles(rootDir);
const regex = /<a?:([a-zA-Z0-9_]+):(\d+)>/g;

let totalReplacements = 0;
let modifiedFiles = 0;

for (const filePath of files) {
    const original = fs.readFileSync(filePath, 'utf8');
    let count = 0;
    const replaced = original.replace(regex, (match, name, id) => {
        count++;
        return getReplacementEmoji(name, id);
    });
    if (count > 0) {
        fs.writeFileSync(filePath, replaced, 'utf8');
        const rel = path.relative(rootDir, filePath);
        console.log(`  ${rel} - ${count} replacements`);
        totalReplacements += count;
        modifiedFiles++;
    }
}

console.log(`\nDone: ${totalReplacements} replacements in ${modifiedFiles} files.`);
