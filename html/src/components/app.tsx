import { h, Component, Fragment } from 'preact';

import { Terminal } from './terminal';

import type { ITerminalOptions, ITheme } from '@xterm/xterm';
import type { ClientOptions, FlowControl } from './terminal/xterm';

const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const path = window.location.pathname.replace(/[/]+$/, '');
const wsUrl = [protocol, '//', window.location.host, path, '/ws', window.location.search].join('');
const tokenUrl = [window.location.protocol, '//', window.location.host, path, '/token'].join('');
const clientOptions = {
    rendererType: 'webgl',
    disableLeaveAlert: false,
    disableResizeOverlay: false,
    enableZmodem: false,
    enableTrzsz: false,
    enableSixel: false,
    closeOnDisconnect: false,
    isWindows: false,
    unicodeVersion: '11',
} as ClientOptions;

const darkTheme: ITheme = {
    foreground: '#d2d2d2',
    background: '#2b2b2b',
    cursor: '#adadad',
    black: '#000000',
    red: '#d81e00',
    green: '#5ea702',
    yellow: '#cfae00',
    blue: '#427ab3',
    magenta: '#89658e',
    cyan: '#00a7aa',
    white: '#dbded8',
    brightBlack: '#686a66',
    brightRed: '#f54235',
    brightGreen: '#99e343',
    brightYellow: '#fdeb61',
    brightBlue: '#84b0d8',
    brightMagenta: '#bc94b7',
    brightCyan: '#37e6e8',
    brightWhite: '#f1f1f0',
};

const lightTheme: ITheme = {
    foreground: '#2c2c2c',
    background: '#ffffff',
    cursor: '#333333',
    black: '#2b2b2b',
    red: '#cc0000',
    green: '#4e9a06',
    yellow: '#a57800',
    blue: '#3465a4',
    magenta: '#75507b',
    cyan: '#06989a',
    white: '#babdb6',
    brightBlack: '#555753',
    brightRed: '#cc0000',
    brightGreen: '#4e9a06',
    brightYellow: '#c47900',
    brightBlue: '#4e7ac7',
    brightMagenta: '#8f5a91',
    brightCyan: '#008b8b',
    brightWhite: '#eeeeec',
};

const savedTheme = localStorage.getItem('ttyd-theme');
const isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
const termOptions = {
    fontSize: isMobile ? 18 : 13,
    fontFamily: 'Consolas,Liberation Mono,Menlo,Courier,monospace',
    theme: savedTheme === 'light' ? lightTheme : darkTheme,
    allowProposedApi: true,
} as ITerminalOptions;

const flowControl = {
    limit: 100000,
    highWater: 10,
    lowWater: 4,
} as FlowControl;

interface State {
    light: boolean;
}

export class App extends Component<{}, State> {
    constructor(props: {}) {
        super(props);
        const light = savedTheme === 'light';
        this.state = { light };
        if (light) document.body.classList.add('theme-light');
    }

    private toggleTheme = () => {
        const light = !this.state.light;
        const theme = light ? lightTheme : darkTheme;
        this.setState({ light });
        document.body.classList.toggle('theme-light', light);
        document.body.style.backgroundColor = theme.background as string;
        document.documentElement.style.backgroundColor = theme.background as string;
        localStorage.setItem('ttyd-theme', light ? 'light' : 'dark');
        if (window.term) window.term.options.theme = theme;
    };

    render(_: {}, { light }: State) {
        return (
            <Fragment>
                <button class="theme-toggle" onClick={this.toggleTheme} title="Toggle theme" aria-label="Toggle theme">
                    {light ? '🌙' : '☀'}
                </button>
                <Terminal
                    id="terminal-container"
                    wsUrl={wsUrl}
                    tokenUrl={tokenUrl}
                    clientOptions={clientOptions}
                    termOptions={termOptions}
                    flowControl={flowControl}
                />
            </Fragment>
        );
    }
}
