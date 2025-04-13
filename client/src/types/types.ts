export interface Order {
    TYPE: string;
    M: string;
    FSYM: string;
    TSYM: string;
    SIDE: number;
    ACTION: number;
    CCSEQ: number;
    P: number;
    Q: number;
    SEQ: number;
    REPORTEDNS: number;
    DELAYNS: number;
    [key: string]: any;
  }