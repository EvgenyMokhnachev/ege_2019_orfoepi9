import React, {Component} from 'react';
import './App.css';
import words from './words.json';

class App extends Component {

    constructor() {
        super();

        this.state = {
            currIndex: 0,
            successCount: 0,
            errorsCount: 0,
            successPercents: '0%',
            lastError: null,
            randomQueue: false
        }
    }

    render() {
        return (
            <div className="App">

                <div className={'configs'}>
                    <label>Случайный порядок <input onClick={this.switchRandomQueue.bind(this)} type="button" value={this.state.randomQueue ? 'ВЫКЛючить' : 'ВКЛючить'}/></label>
                </div>

                {this.state.lastError ? (
                    <div className={'lastError'}>
                        <div className={'true_word'}>{this.state.lastError.word}</div>
                        <div className={'error_word'}>{this.state.lastError.error}</div>
                    </div>
                ) : null}

                <div>
                    <div className={'word'}>{words[this.state.currIndex].word.toLowerCase()}</div>

                    {(words[this.state.currIndex].tiny_desc) ? (
                        <div className={'tiny_desc'}>{words[this.state.currIndex].tiny_desc.toLowerCase()}</div>
                    ) : null}

                    <div className={'variants'}>
                        {this.shuffle(this.generateVariants(words[this.state.currIndex].word)).map((variant, varKey) => {
                            return (
                                <div key={varKey} onClick={this.onClickVariant.bind(this, variant, words[this.state.currIndex].word)}
                                     className={'variant_item'}>
                                    {variant}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className={'stats'}>
                    <div className={'progress_bar'}>
                        <div className={'success_progress_bar'} style={{width: this.state.successPercents}}/>
                    </div>
                    <div className={'progress_counts'}>
                        <div>Верно: {this.state.successCount}</div><div>Ошибок: {this.state.errorsCount}</div>
                    </div>
                </div>

            </div>
        );
    }

    switchRandomQueue() {
        this.setState({
            randomQueue: !this.state.randomQueue
        })
    }

    generateVariants(word) {
        let wowers = this.getWowers(word);
        let startIndex = 0;
        return wowers.map((wower) => {
            let wordSplit = word.toLowerCase().split('');
            let index = wordSplit.indexOf(wower, startIndex);
            wordSplit[index] = wower.toUpperCase();
            startIndex = ++index;
            return wordSplit.join('');
        });
    }

    getWowers(str) {
        let cloneStr = str + '';
        cloneStr = cloneStr.toLowerCase().replace(/[^аеёиоуыэюя]/ig, '');
        return cloneStr.split('');
    }

    onClickVariant(variant, word) {
        let currIndex = this.state.currIndex;
        let successCount = this.state.successCount;
        let errorsCount = this.state.errorsCount;

        this.setState({
            currIndex: this.getNextWordIndex(currIndex),
            successCount: (word === variant) ? ++successCount : successCount,
            errorsCount: (word !== variant) ? ++errorsCount : errorsCount,
            successPercents: ((isNaN(successCount * 100 / (successCount + errorsCount))) ?
                0 : successCount * 100 / (successCount + errorsCount)) + "%",
            lastError: (word !== variant) ? ({word: word, error: variant}) : (this.state.lastError)
        });
    }

    getNextWordIndex(curr) {
        if (this.state.randomQueue) {
            let nextIndex = this.generateRandom(1, words.length);
            while (curr === nextIndex) {
                nextIndex = this.generateRandom(1, words.length);
            }
            return nextIndex;
        }
        return (words.length === ++curr) ? curr = 0 : curr;

    }

    generateRandom(from, to) {
        return Math.floor((Math.random() * to) + from);
    }


    shuffle(original) {
        let array = original.slice(0);
        let currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

}

export default App;
