class Cheats{
    constructor(){
        this.textBuffer = "";
        this.keyBuffer = [];

        this.maxTextLength = 20;
        this.maxKeyLength = 10;

        this.codes = [
            {
                type: "text",
                code: "godmode",
                action: () => console.log("god mode ativado")
            },
            {
                type: "sequence",
                code: ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"],
                action: () => console.log("god mode ativado")
            },
            {
                type: "text",
                code: "cogu",
                action: () => console.log("cogu ativado")
            },
            {
                type: "sequence",
                code: ["ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight"],
                action: () => console.log("cogu ativado")
            },
            {
                type: "text",
                code: "autofire",
                action: () => console.log("autofire ativado") 
            },
            {
                type: "sequence",
                code: ["ArrowUp", "ArrowUp", "ArrowUp", "ArrowDown"],
                action: () => console.log("autofire ativado")
            }
        ];
    }

    handleInput(key){
        this.handleText(key);
        this.handleSequence(key);
    }

    handleText(key){
        if(key.length === 1){
            this.textBuffer += key.toLowerCase();

            if (this.textBuffer.length > this.maxTextLength){
                this.textBuffer = this.textBuffer.slice(-this.maxTextLength);
            }
            this.checkText();
        }
    }

    checkText(){
        this.codes.forEach(c => {
            if (c.type === "text" && this.textBuffer.includes(c.code)){
                c.action();
                this.textBuffer = "";
            }
        })
    }

    handleSequence(key){
        this.keyBuffer.push(key);
        
        if (this.keyBuffer.length > this.maxKeyLength){
            this.keyBuffer.shift();
        }
        this.checkSequence();
    }

    checkSequence(){
        this.codes.forEach(c => {
            if (c.type === "sequence" && this.matches(c.code)){
                c.action();
                this.keyBuffer = [];
            }
        })
    }

    matches(code){
        if(this.keyBuffer.length < code.length) return false;

        const recent = this.keyBuffer.slice(-code.length);

        return code.every((key, i) => key === recent[i])
    }
}

export default Cheats;