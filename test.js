const fetch = require('node-fetch');

async function main() {
    const link = 'https://fshare.vn/download?link=https://download040.fshare.vn/dl/avK4Q9qgiapgiQL5c7WYozLfY0I42O1JJQ1mab2ukuLj-3DpAdB6CCF6pYPiMLEcflpwB9wK33yEhkzb/%5BFullcrackpc.com%5D%20Final.Fantasy.XV.Windows.Edition.Episode.Ardyn-CODEX.iso';
    const shortenRes = await fetch('https://megaurl.in/api?api=6137549b1c06c25a2153b4a10f050643aef11f34&url=' + link);
    const shorten = await shortenRes.json();
    console.log(shorten);
}

main();