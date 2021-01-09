// Helper function for formating minutes and seconds
let formatSeconds = sec => {
  let seconds = ("0" + sec % 60).slice(-2);
  let minutes = Math.floor(sec / 60);
  return minutes + ":" + seconds;
};
// Set default times for break and session
let DEFAULT_START = 25 * 60,
DEFAULT_BREAK = 5 * 60;
// Set up for parent component
const PomodoroComponent = React.createClass({ displayName: "PomodoroComponent",
  // Get initial state for components
  getInitialState: function () {
    return {
      isRunning: false,
      sessionStart: DEFAULT_START,
      breakStart: DEFAULT_BREAK,
      sessionClock: DEFAULT_START,
      breakClock: DEFAULT_BREAK,
      secondsElapsed: 0,
      mode: 'session',
      bgColor: {
        'session': 'tomato',
        'break': 'forestgreen' } };


  },
  // Decrementer for session and break clocks
  tick: function () {
    var self = this;
    if (this.state.mode === 'session') {
      this.decrementer = setInterval(function () {
        self.setState({
          sessionClock: self.state.sessionClock - 1,
          secondsElapsed: self.state.secondsElapsed + 1 });

        if (self.state.sessionClock < 0) {
          self.onTimeout();
        }
      }, 1000);
    } else {
      this.decrementer = setInterval(function () {
        self.setState({
          breakClock: self.state.breakClock - 1,
          secondsElapsed: self.state.secondsElapsed + 1 });

        if (self.state.breakClock < 0) {
          self.onTimeout();
        }
      }, 1000);
    }
  },
  // Set up session and break countdown configs then call tick function
  countDown: function () {
    this.setState({
      isRunning: true });

    if (this.state.mode === 'session') {// Set Session state and begin countdown
      this.setState({
        sessionClock: this.state.sessionClock,
        sessionStart: this.state.sessionStart });

      this.tick(); // Initiate countdown
    } else {// Set Break state and begin countdown
      this.setState({
        breakClock: this.state.breakClock,
        breakStart: this.state.breakStart });

      this.tick(); // Initiate countdown
    }
  },
  // Handle clock state and logic once time has ended
  onTimeout: function () {
    // Play boxing bell sound effect
    this.playAudio();
    // Set state for break or session and start countdown
    if (this.state.mode === 'session') {
      clearInterval(this.decrementer);
      this.setState({
        isRunning: false,
        mode: 'break',
        breakClock: this.state.breakStart,
        secondsElapsed: 0 });

      this.countDown();
    } else {
      clearInterval(this.decrementer);
      this.setState({
        isRunning: false,
        mode: 'session',
        sessionClock: this.state.sessionStart,
        secondsElapsed: 0 });

      this.countDown();
    }
  },
  // clearTimeout, reset the clock to initial session start and set mode to "session"
  handleResetClick: function () {
    clearTimeout(this.decrementer);
    this.setState({
      isRunning: false,
      sessionClock: this.state.sessionStart,
      mode: 'session',
      secondsElapsed: 0 });

  },
  // Kick off countdown by calling the countDown function
  handleStartClick: function () {
    this.countDown();
  },
  // Stop/pause clock
  handleStopClick: function () {
    clearInterval(this.decrementer);
    this.setState({
      isRunning: false,
      lastClearedDecrementer: this.decrementer });

  },
  // Set new break length based on user input
  handleBreakChange: function (event) {
    this.setState({
      breakStart: parseInt(event.target.value) * 60,
      breakClock: parseInt(event.target.value) * 60 });

  },
  // Set new session length based on user input
  handleSessionChange: function (event) {
    this.setState({
      sessionStart: parseInt(event.target.value) * 60,
      sessionClock: parseInt(event.target.value) * 60 });

  },
  // Play sound effect when session/break ends
  playAudio: function () {
    let audioFile = 'https://www.freesfx.co.uk/rx2/mp3s/5/5745_1335777561.mp3',
    audio = new Audio(audioFile);
    audio.play();
  },
  // Render the Session clock and progress bar components passing in state
  render: function () {
    return /*#__PURE__*/(
      React.createElement("div", null, /*#__PURE__*/
      React.createElement(ProgressBarComponent, {
        sessionClock: this.state.sessionClock,
        breakClock: this.state.breakClock,
        sessionStart: this.state.sessionStart,
        breakStart: this.state.breakStart,
        mode: this.state.mode,
        bgColor: this.state.bgColor }), /*#__PURE__*/

      React.createElement(SessionClockComponent, {
        mode: this.state.mode,
        isRunning: this.state.isRunning,
        sessionStart: this.state.sessionStart,
        breakStart: this.state.breakStart,
        sessionClock: this.state.sessionClock,
        breakClock: this.state.breakClock,
        onStartClick: this.handleStartClick,
        onStopClick: this.handleStopClick,
        onResetClick: this.handleResetClick,
        onBreakChange: this.handleBreakChange,
        onSessionChange: this.handleSessionChange })));


  } });

// Set up Session Clock component
const SessionClockComponent = React.createClass({ displayName: "SessionClockComponent",
  render: function () {
    return /*#__PURE__*/(
      React.createElement("div", null, /*#__PURE__*/
      React.createElement("div", { className: "container" }, /*#__PURE__*/
      React.createElement("div", { className: "pomodoro" }, /*#__PURE__*/
      React.createElement("h1", { className: "uppercase title" }, "Temporizador Pomodoro"), /*#__PURE__*/
      React.createElement("div", { className: "timer-options" }, /*#__PURE__*/
      React.createElement("div", { className: "form-inputs" }, /*#__PURE__*/
      React.createElement("label", { htmlFor: "Break" }, "Minutos de descanso"), /*#__PURE__*/
      React.createElement("input", { name: "Break",
        className: "break-input",
        type: "number",
        defaultValue: "5",
        value: this.props.breakStart / 60, min: "1", max: "60",
        disabled: this.props.isRunning,
        onChange: this.props.onBreakChange })), /*#__PURE__*/

      React.createElement("div", { className: "form-inputs" }, /*#__PURE__*/
      React.createElement("label", { htmlFor: "Session" }, "Minutos de trabajo"), /*#__PURE__*/
      React.createElement("input", { name: "Session",
        className: "session-input",
        type: "number",
        defaultValue: "25",
        value: this.props.sessionStart / 60, min: "1", max: "60",
        disabled: this.props.isRunning,
        onChange: this.props.onSessionChange }))), /*#__PURE__*/



      React.createElement("span", { className: "mode-display" }, this.props.mode), /*#__PURE__*/
      React.createElement("h1", { className: "timer" },
      this.props.mode === 'session' ?
      formatSeconds(this.props.sessionClock) :
      formatSeconds(this.props.breakClock)),


      !this.props.isRunning ? /*#__PURE__*/
      React.createElement("button", { type: "button", onClick: this.props.onStartClick }, "Empezar") : /*#__PURE__*/
      React.createElement("button", { type: "button", onClick: this.props.onStopClick }, "Pausa"), /*#__PURE__*/

      React.createElement("button", { type: "button",
        disabled: this.props.isRunning,
        onClick: this.props.onResetClick }, "Reset")))));




  } });

// Set up Progress Bar component
const ProgressBarComponent = React.createClass({ displayName: "ProgressBarComponent",
  render: function () {
    // Set width and backGround color parameters for styling progress bar
    let fill = {
      'width': this.props.mode === 'session' ?
      (this.props.sessionStart - this.props.sessionClock) * 100 / this.props.sessionStart + '%' :
      (this.props.breakStart - this.props.breakClock) * 100 / this.props.breakStart + '%',
      'backgroundColor': this.props.mode == 'session' ? this.props.bgColor.session : this.props.bgColor.break };


    return /*#__PURE__*/(
      React.createElement("div", null, /*#__PURE__*/
      React.createElement("div", { className: "progress-bar", style: fill }), /*#__PURE__*/
      React.createElement("div", { className: "progress-bar-line" })));


  } });


React.render( /*#__PURE__*/React.createElement(PomodoroComponent, null), root);