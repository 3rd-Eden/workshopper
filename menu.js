const tmenu        = require('terminal-menu')
    , path         = require('path')
    , fs           = require('fs')
    , xtend        = require('xtend')
    , EventEmitter = require('events').EventEmitter
    , chalk        = require('chalk')

const util         = require('./util')

function writeLine(menu, width) {
  menu.write(util.repeat('\u2500', width) + '\n')
}

function showMenu (opts, i18n) {

  var emitter         = new EventEmitter()
    , menu            = tmenu(xtend({
          width : opts.width
        , x     : 3
        , y     : 2
      }, opts.menu))
    , __              = i18n.__
    , __n             = i18n.__n

  menu.reset()
  menu.write(chalk.bold(__('title')) + '\n')
  if (i18n.has('subtitle'))
    menu.write(chalk.italic(__('subtitle')) + '\n')

  writeLine(menu, opts.width)
  
  function emit(event, value) {
    return process.nextTick.bind(process, emitter.emit.bind(emitter, event, value))
  }

  opts.primaries.forEach(function (entry) {
    var prefix = chalk.bold('»') + ' '
      , size = opts.width - 2
    menu.add(util.applyTextMarker(prefix + entry.name, entry.marker, size), emit('select', entry.id))
  })

  writeLine(menu, opts.width)

  opts.secondaries.forEach(function (entry) {
    menu.add(chalk.bold(entry.name), emit(entry.command))
  })

  function regexpEncode(str) {
    return str.replace(/([\.\*\+\?\{\}\[\]\- \(\)\|\^\$\\])/g, "\\$1")
  }

  menu.on('select', function (label) {
    menu.y = 0
    menu.reset()
    menu.close()
  })

  menu.createStream().pipe(process.stdout)
  
  return emitter
}


module.exports = showMenu