const appName = 'com.church.renjie.Bible'

if (process.platform == 'win32') {
    var userDir = process.env['APPDATA'].concat('\\',appName,'\\')
} else if (process.platform == 'darwin') {
    var userDir = process.env['HOME'].concat('/Library/Application\\ Support/',appName,'/')
} else {
    var userDir = ''
}

function conf(f) {
    return userDir.concat('.',f,'.conf')
}


module.exports = {

    save: function(name='default',state) {
        var json = JSON.stringify(state)
        var fs = require('fs')
        fs.writeFile(conf(name),json,'utf8',(err) => {
            if (err) console.log(err)
        })
    },

    load: function(name='default',fallback) {
        var fs = require('fs')
        try {
            fs.accessSync(conf(name),fs.constants.R_OK)
            var data = fs.readFileSync(conf(name))
            var json = JSON.parse(data)
        } catch(err) {
            var json = fallback
        }
        return json
    },
}