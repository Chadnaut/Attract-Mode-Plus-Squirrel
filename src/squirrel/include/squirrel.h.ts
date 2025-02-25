/*
Copyright (c) 2003-2012 Alberto Demichelis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
import { iswalnum, iswalpha, iswcntrl, iswdigit, iswxdigit, wcstod } from "./std";

export type TokenType = string | undefined;

export const scstrtod = wcstod; // #L129

export const scisdigit = iswdigit; // #L140
export const scisxdigit = iswxdigit;
export const scisalpha = iswalpha;
export const sciscntrl = iswcntrl;
export const scisalnum = iswalnum;

export const MAX_CHAR = 0xFFFF; // #L146

export const SQUIRREL_EOB = undefined; // #L193

export type SQLEXREADFUNC = (text: string) => TokenType; // #L301

export enum OT { // #L225
    NULL,
    INTEGER,
    FLOAT,
    BOOL,
    STRING,
    TABLE,
    ARRAY,
    USERDATA,
    CLOSURE,
    NATIVECLOSURE,
    GENERATOR,
    USERPOINTER,
    THREAD,
    FUNCPROTO,
    CLASS,
    INSTANCE,
    WEAKREF,
    OUTER,
}

export type SQObjectType = OT;

export type SQObject = { // #L273
	_type: SQObjectType;
	_unVal: any;
    _rawVal?: string;
}
