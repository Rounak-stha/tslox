// This file was generated by lezer-generator. You probably shouldn't edit it.
import { LRParser } from '@lezer/lr'
const spec_Identifier = { __proto__: null, let: 20, var: 22, const: 24 }
export const parser = LRParser.deserialize({
    version: 14,
    states: "!^QYQPOOOqQPO'#CdOOQO'#Cm'#CmOOQO'#Ci'#CiQYQPOOOOQO'#Ce'#CeOOQO,59O,59OOxQPO,59OOOQO-E6g-E6gOOQO1G.j1G.j",
    stateData: '!P~O`OSPOS~ORQOSQOTQOVPOYTOZTO[TO~OUUO~PYOUXO~PYO',
    goto: 'ybPPPPPPPPccPPPiPPPsXQOPSVQSOQVPTWSVXROPSV',
    nodeNames: '⚠ LineComment Program Identifier String Boolean ) ( Application VariableDeclaration let var const',
    maxTerm: 17,
    nodeProps: [
        ['openedBy', 6, '('],
        ['closedBy', 7, ')']
    ],
    skippedNodes: [0, 1],
    repeatNodeCount: 1,
    tokenData:
        "%i~R^XY}YZ}]^}pq}rs!`st#|xy$[yz$a}!O$f!P!Q$z!Q![$f!c!}$f#R#S$f#T#o$f~!SS`~XY}YZ}]^}pq}~!cVOr!`rs!xs#O!`#O#P!}#P;'S!`;'S;=`#v<%lO!`~!}OS~~#QRO;'S!`;'S;=`#Z;=`O!`~#^WOr!`rs!xs#O!`#O#P!}#P;'S!`;'S;=`#v;=`<%l!`<%lO!`~#yP;=`<%l!`~$PQ#Y#Z$V#h#i$V~$[OT~~$aOV~~$fOU~~$kTR~}!O$f!Q![$f!c!}$f#R#S$f#T#o$f~$}P!P!Q%Q~%VSP~OY%QZ;'S%Q;'S;=`%c<%lO%Q~%fP;=`<%l%Q",
    tokenizers: [0],
    topRules: { Program: [0, 2] },
    // eslint-disable-next-line
    specialized: [{ term: 3, get: (value) => spec_Identifier[value] || -1 }],
    tokenPrec: 0
})
