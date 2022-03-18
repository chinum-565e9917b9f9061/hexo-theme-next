hexo.extend.tag.register("voca_bililink", (args) => {
    var video_id = args[0];
    return `<p><a target="_blank" rel="noopener" href="https://www.bilibili.com/video/${video_id}/">Bilibili: <code>${video_id}</code></a></p>`;
});

hexo.extend.tag.register("voca_lyricsblock", (args, content) => {
    var res = content,
        chara_list = [
            //(Virtual Singers) VOCALOID - Crypton
            "miku", "luka", "rin", "len", "meiko", "kaito",
            //(Virtual Singers) VOCALOID China - 天矢禾念
            "tianyi", "ling", "yanhe", "longya", "qingxian", "moke",
            //(Others) Diva Project Sekai - Leo/need
            "hoshinoichika", "tenmasaki", "mochizukihonami", "hinomorishiho",
            //(Others) LOVELIVE - Liella!
            "kanon", "chisato", "sumire", "keke", "ren",
        ],
        color_dict = {
            "liella": "magenta", // LOVELIVE - Liella!
        };
    // Replacing the `\n`s to HTML Tag `<br />`s...
    var lines = res.split(/\n/g);
    var num_lines = lines.length;
    res = lines[0];
    for (var k = 1; k != lines.length; ++k)
        res += `<br />${lines[k]}`;
    // Parsing the Tags `<~{name}>`
    var parts2end = res.split(/<endall~~>/g);
    res = "";
    for (var k in parts2end) {
        for (var eachkey of chara_list) {
            var re_starter = RegExp(`<~${eachkey}>`),
                re_ender = RegExp(`<${eachkey}~>`);
            if (parts2end[k].search(re_starter) != -1) {
                var parts = parts2end[k].split(re_starter);
                parts2end[k] = parts[0];
                for (var l = 1; l != parts.length; ++l) {
                    if (parts[l].search(re_ender) != -1) {
                        parts[l] = parts[l].replace(re_ender, `</span>`);
                        while (parts[l].search(re_ender) != -1)
                            parts[l] = parts[l].replace(re_ender, ``);
                    } else
                        parts[l] += `</span>`;
                    parts2end[k] += `<span class="base16character-${eachkey}">` + parts[l];
                }
            }
        }
        for (var eachkey in color_dict) {
            var re_starter = RegExp(`<~${eachkey}>`),
                re_ender = RegExp(`<${eachkey}~>`);
            if (parts2end[k].search(re_starter) != -1) {
                var parts = parts2end[k].split(re_starter);
                parts2end[k] = parts[0];
                for (var l = 1; l != parts.length; ++l) {
                    if (parts[l].search(re_ender) != -1) {
                        parts[l] = parts[l].replace(re_ender, `</span>`);
                        while (parts[l].search(re_ender) != -1)
                            parts[l] = parts[l].replace(re_ender, ``);
                    } else
                        parts[l] += `</span>`;
                    parts2end[k] += `<span class="base16colored-${color_dict[eachkey]}">` + parts[l];
                }
            }
        }
        res += parts2end[k];
    }
    if (args.length >= 1) {
        var res_gutter = ``,
            res_code = `<span class="line">${res}</span>`;
        for (var k = 1; k <= num_lines; ++k)
            res_gutter += `<span class="line">${k}</span><br />`;
        return `<figure class="highlight vocatag vocalyrics">
            <table>
                <tbody>
                    <tr>
                        <td class="gutter">
                            <pre>${res_gutter}</pre>
                        </td>
                        <td class="code">
                            <pre>${res_code}</pre>
                        </td>
                    </tr>
                </tbody>
            </table>
        </figure>`;
    } else
        return `<pre class="vocalyricsblock"><code>${res}</code></pre>`;
}, {ends: true});
