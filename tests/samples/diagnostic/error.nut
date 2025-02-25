// Every line has a compiler error

local a; a <- 1; // can't 'create' a local slot
const b = 1; b = 2; // can't assign expression
const c = -{ x = 1 }; // scalar expected : integer,float
const d = { x = 1 }; // scalar expected : integer,float or string
enum e { x = { y = 1} }; // scalar expected : integer,float or string
class 1 {} // invalid class name
class {} // invalid class name
local f; class f {}; // cannot create a class in a local
local g = 1 local h = 2 // end of statement expected
const i = 1; delete i; // can't delete an expression
local j = 1; delete j; // cannot delete an (outer) local
delete this; // cannot delete an (outer) local
enum k { x = 1 }; x = k; // expected '.'
enum l { x = 1 }; x = l.; // expected 'IDENTIFIER'
enum m { x = 1 }; x = m.y; // invalid constant
enum n { x = 1 }; n.x = 2; // can't assign expression
function o(x = 1, ...) {} // cannot have variable number of parameters
function p(..., x) {} // expected ')'
function q(x = 1, y) {} // expected '='
function r(x}){} // expected ')' or ','
func(a,) // expression expected, found ')'
++(1+2); // can't '++' or '--' an expression
const s = 1; ++s; // can't '++' or '--' an expression
const t = 1; t++; // can't '++' or '--' an expression
if {} ) // expected '('
break; // 'break' has to be in a loop block
while (1) { function a () { break; } } // 'break' has to be in a loop block
continue; // 'continue' has to be in a loop block
while (1) { function a () { continue; } } // 'continue' has to be in a loop block
switch (a) { case 1: continue; } // 'continue' has to be in a loop block
base = 123; // `base` cannot be modified

// MULTILINE
x // cannot brake deref
[1]

// LEXER
a1..a2 // invalid token '..'
"newline
" // newline in a constant "
"\xN" // hexadecimal number expected
"\k" // unrecognised escaper char
'' // empty constant
'nn' // constant too long
0779 // invalid octal number
079 // invalid octal number
0xFFFFFFFF1 // too many digits for an Hex number
0xFFFFFFFF111 // too many digits for an Hex number
1ex // exponent expected

// // These must be at end-of-file to throw
// /* missing * / in comment
// @" // error parsing the string
// "x // unfinished string
// " // error parsing the string
