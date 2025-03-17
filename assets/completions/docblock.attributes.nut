/**
 * DocBlock Attributes
 *
 * @package DocBlock
 * @global
 */

/**
 * @keyword abstract This member must be implemented (or overridden) by the inheritor.
 * @kind attr
 * @snippet abstract
 *
 * @keyword alias Treat a member as if it had a different name.
 * @kind attr
 * @snippet alias ${1:name}
 *
 * @keyword artwork Document the artwork resource labels.
 * @kind attr
 * @snippet artwork ${1:name}
 *
 * @keyword async Indicate that a function is asynchronous.
 * @kind attr
 * @snippet async
 *
 * @keyword augments Indicate that a symbol inherits from, and adds to, a parent symbol.
 * @kind attr
 * @snippet augments ${1:name}
 *
 * @keyword author Identify the author of an item.
 * @kind attr
 * @snippet author ${1:name}<${2:link}>
 *
 * @keyword borrows This object uses something from another object.
 * @kind attr
 * @snippet borrows ${1:name} as ${2:alias}
 *
 * @keyword callback Document a callback function.
 * @kind attr
 * @snippet callback ${1:name}
 *
 * @keyword class This function is intended to create an instance.
 * @kind attr
 * @snippet class
 *
 * @keyword classdesc Use the following text to describe the entire class.
 * @kind attr
 * @snippet classdesc ${1:description}
 *
 * @keyword constant Document an object as a constant.
 * @kind attr
 * @snippet constant {${1:type}} ${2:name} ${3:description}
 *
 * @keyword constructs This function member will be the constructor for the previous class.
 * @kind attr
 * @snippet constructs ${1:name}
 *
 * @keyword copyright Document some copyright information.
 * @kind attr
 * @snippet copyright ${1:description}
 *
 * @keyword default Document the default value.
 * @kind attr
 * @snippet default ${1:name}
 *
 * @keyword deprecated Document that this is no longer the preferred way.
 * @kind attr
 * @snippet deprecated ${1:description}
 *
 * @keyword description Describe a symbol.
 * @kind attr
 * @snippet description ${1:description}
 *
 * @keyword enum Document a collection of related properties.
 * @kind attr
 * @snippet enum {${1:type}}
 *
 * @keyword event Document an event.
 * @kind attr
 * @snippet event ${1:name}
 *
 * @keyword example Provide an example of how to use a documented item.
 * @kind attr
 * @snippet example ${1:description}
 *
 * @keyword exports Identify the member that is exported by a module.
 * @kind attr
 * @snippet exports ${1:name}
 *
 * @keyword external Identifies an external class, namespace, or module.
 * @kind attr
 * @snippet external ${1:name}
 *
 * @keyword file Describe a file.
 * @kind attr
 * @snippet file ${1:description}
 *
 * @keyword fires Describe the events this method may fire.
 * @kind attr
 * @snippet fires ${1:name}
 *
 * @keyword function Describe a function or method.
 * @kind attr
 * @snippet function ${1:name}
 *
 * @keyword generator Indicate that a function is a generator function.
 * @kind attr
 * @snippet generator
 *
 * @keyword getter Document a getter of an object.
 * @kind attr
 * @snippet getter {${1:type}} ${2:name} ${3:description}
 *
 * @keyword global Document a global object.
 * @kind attr
 * @snippet global
 *
 * @keyword hideconstructor Indicate that the constructor should not be displayed.
 * @kind attr
 * @snippet hideconstructor
 *
 * @keyword ignore Omit a symbol from the documentation.
 * @kind attr
 * @snippet ignore
 *
 * @keyword implements This symbol implements an interface.
 * @kind attr
 * @snippet implements {${1:type}}
 *
 * @keyword inheritdoc Indicate that a symbol should inherit its parent's documentation (except ignore).
 * @kind attr
 * @snippet inheritdoc
 *
 * @keyword inheritdoc! Indicate that a symbol should inherit its parent's documentation.
 * @kind attr
 * @snippet inheritdoc!
 *
 * @keyword inner Document an inner object.
 * @kind attr
 * @snippet inner
 *
 * @keyword instance Document an instance member.
 * @kind attr
 * @snippet instance
 *
 * @keyword interface This symbol is an interface that others can implement.
 * @kind attr
 * @snippet interface ${1:name}
 *
 * @keyword keyword Document the behaviour of a keyword.
 * @kind attr
 * @snippet keyword ${1:name}
 *
 * @keyword kind What kind of symbol is this?
 * @kind attr
 * @snippet kind ${1|class,constant,event,external,file,function,member,module,property|}
 *
 * @keyword lends Document properties on an object literal as if they belonged to a symbol with a given name.
 * @kind attr
 * @snippet lends ${1:name}
 *
 * @keyword license Identify the license that applies to this code.
 * @kind attr
 * @snippet license ${1:name}
 *
 * @keyword listens List the events that a symbol listens for.
 * @kind attr
 * @snippet listens ${1:name}
 *
 * @keyword magic Document a magic token.
 * @kind attr
 * @snippet magic ${1:name}
 *
 * @keyword member Document a member.
 * @kind attr
 * @snippet member {${1:type}} ${2:name}
 *
 * @keyword memberof This symbol belongs to a parent symbol.
 * @kind attr
 * @snippet memberof ${1:name}
 *
 * @keyword memberof! Force this symbol to belongs to a parent symbol.
 * @kind attr
 * @snippet memberof! ${1:name}
 *
 * @keyword mixes This object mixes in all the members from another object.
 * @kind attr
 * @snippet mixes ${1:name}
 *
 * @keyword mixin Document a mixin object.
 * @kind attr
 * @snippet mixin ${1:name}
 *
 * @keyword module Document a module.
 * @kind attr
 * @snippet module ${1:name}
 *
 * @keyword name Document the name of an object.
 * @kind attr
 * @snippet name ${1:name}
 *
 * @keyword namespace Document a namespace object.
 * @kind attr
 * @snippet namespace {${1:type}} ${2:name}
 *
 * @keyword override Indicate that a symbol overrides its parent.
 * @kind attr
 * @snippet override
 *
 * @keyword package Document the package name for this file.
 * @kind attr
 * @snippet package ${1:name}
 *
 * @keyword param Document the parameter to a function.
 * @kind attr
 * @snippet param {${1:type}} ${2:name} ${3:description}
 *
 * @keyword private This symbol is meant to be private.
 * @kind attr
 * @snippet private
 *
 * @keyword property Document a property of an object.
 * @kind attr
 * @snippet property {${1:type}} ${2:name} ${3:description}
 *
 * @keyword protected This symbol is meant to be protected.
 * @kind attr
 * @snippet protected
 *
 * @keyword public This symbol is meant to be public.
 * @kind attr
 * @snippet public
 *
 * @keyword readonly This symbol is meant to be read-only.
 * @kind attr
 * @snippet readonly
 *
 * @keyword requires This file requires a module.
 * @kind attr
 * @snippet requires ${1:name}
 *
 * @keyword returns Document the return value of a function.
 * @kind attr
 * @snippet returns {${1|integer,float,string,boolean,null|}} ${2:description}
 *
 * @keyword see Refer to some other documentation for more information.
 * @kind attr
 * @snippet see ${1:name}
 *
 * @keyword setter Document a setter of an object.
 * @kind attr
 * @snippet setter {${1:type}} ${2:name} ${3:description}
 *
 * @keyword since When was this feature added?
 * @kind attr
 * @snippet since ${1:version}
 *
 * @keyword snippet Document a completion snippet.
 * @kind attr
 * @snippet snippet
 *
 * @keyword static Document a static member.
 * @kind attr
 * @snippet static
 *
 * @keyword summary A shorter version of the full description.
 * @kind attr
 * @snippet summary ${1:description}
 *
 * @keyword this What does the 'this' keyword refer to here?
 * @kind attr
 * @snippet this ${1:name}
 *
 * @keyword throws Describe what errors could be thrown.
 * @kind attr
 * @snippet throws {${1:type}} ${2:description}
 *
 * @keyword todo Document tasks to be completed.
 * @kind attr
 * @snippet todo ${1:description}
 *
 * @keyword tutorial Insert a link to an included tutorial file.
 * @kind attr
 * @snippet tutorial ${1:name}
 *
 * @keyword type Document the type of an object.
 * @kind attr
 * @snippet type {${1:type}}
 *
 * @keyword typedef Document a custom type.
 * @kind attr
 * @snippet typedef {${1:type}} ${1:name}
 *
 * @keyword url Document a website link.
 * @kind attr
 * @snippet url ${1:name}
 *
 * @keyword var Document a variable.
 * @kind attr
 * @snippet var {${1:type}} ${1:name}
 *
 * @keyword variation Distinguish different objects with the same name.
 * @kind attr
 * @snippet variation ${1:name}
 *
 * @keyword version Documents the version number of an item.
 * @kind attr
 * @snippet version ${1:name}
 *
 * @keyword yields Document the value yielded by a generator function.
 * @kind attr
 * @snippet yields ${1:type}
 */