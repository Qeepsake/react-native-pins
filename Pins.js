/**
 * @author Luke Brandon Farrell
 * @description Pins component with shake animation
 */

import React, { Component } from "react";
import { Animated, StyleSheet, Vibration } from "react-native";
import PropTypes from "prop-types";

class Pins extends Component {
  /**
   * [ Built-in React method. ]
   *
   * Allows us to render JSX to the screen
   */
  constructor(props) {
    super(props);

    this.state = {
      shake: new Animated.Value(0),
      animatedPinValue: new Animated.Value(0),
      positionOfActivePin: 1,
      prevPinSizes: [],
      currentPinSizes: [],
    };

    this.setPositionOfPins = this.setPositionOfPins.bind(this);
    this.getPinSize = this.getPinSize.bind(this);
    this.updatePinSizes = this.updatePinSizes.bind(this);
  }

  /**
   * [ Built-in React method. ]
   *
   * Executed when the component is mounted to the screen.
   */
  componentDidMount() {
    if (this.props.onRef != undefined) {
      this.props.onRef(this);
    }

    // Get and set the initial pin sizes
    const { numberOfPins } = this.props;
    let initialPinSizes = [];
    for (let p = 0; p < numberOfPins; p++) {
      let size = this.getPinSize(p);
      initialPinSizes[p] = size;
    }
    this.setState({
      prevPinSizes: initialPinSizes,
      currentPinSizes: initialPinSizes,
    });
  }

  /**
   * [ Built-in React method. ]
   *
   * Executed when the component is unmounted from the screen
   */
  componentWillUnmount() {
    if (this.props.onRef != undefined) {
      this.props.onRef(undefined);
    }
  }

  /**
   * [ Built-in React method. ]
   *
   * Executed when there is any changes to the props or state
   */
  componentDidUpdate(prevProps) {
    const prevNumberOfPinsActive = prevProps.numberOfPinsActive;
    const { numberOfPinsActive } = this.props;

    if (prevNumberOfPinsActive != numberOfPinsActive) {
      this.setPositionOfPins(prevNumberOfPinsActive).then(() => {
        this.updatePinSizes();

        // Reset animation to so we can reanimate the pins
        this.state.animatedPinValue.setValue(0);
        Animated.timing(this.state.animatedPinValue, {
          duration: 300,
          toValue: 1,
          useNativeDriver: false,
        }).start();
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.currentPinSizes != nextState.currentPinSizes ||
      this.props.numberOfPinsActive != nextProps.numberOfPinsActive
    );
  }

  /**
   * [ Built-in React method. ]
   *
   * Allows us to render JSX to the screen
   */
  render() {
    /** Styles */
    const {
      containerDefaultStyle,
      pinDefaultStyle,
      pinActiveDefaultStyle,
    } = styles;
    /** Props */
    const {
      numberOfPinsActive,
      numberOfPins,
      numberOfPinsMaximum,
      // Style Props
      containerStyle,
      pinStyle,
      pinActiveStyle,
      activeOnly,
      pinSize,
      spacing,
    } = this.props;
    /** State */
    const {
      shake,
      animatedPinValue,
      prevPinSizes,
      currentPinSizes,
    } = this.state;

    // Create the pins from set props
    const pins = [];
    const hasMaxNumberOfPins =
      numberOfPinsMaximum < numberOfPins &&
      numberOfPinsMaximum > 0 &&
      numberOfPins;

    for (let p = 0; p < numberOfPins; p++) {
      const prevSize = prevPinSizes[p];
      const currentSize = currentPinSizes[p];
      const currentSizeIsMoreThanZero = hasMaxNumberOfPins ? currentSize > 0 : true;

      const size = hasMaxNumberOfPins
        ? animatedPinValue.interpolate({
            inputRange: [0, 1],
            outputRange: [prevSize, currentSize],
          })
        : pinSize;

      pins.push(
        <Animated.View
          key={p}
          style={[
            pinDefaultStyle,
            pinStyle,
            activeOnly
              ? p == numberOfPinsActive - 1
                ? { ...pinActiveDefaultStyle, ...pinActiveStyle }
                : {}
              : p < numberOfPinsActive
              ? { ...pinActiveDefaultStyle, ...pinActiveStyle }
              : {},
            pinSize && {
              width: size,
              height: size,
              borderRadius: size,
            },
            spacing &&
              currentSizeIsMoreThanZero && {
                marginRight: spacing,
                marginLeft: spacing,
              },
          ]}
        />
      );
    }

    // Create the shake animation via interpolation
    const shakeAnimation = shake.interpolate({
      inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
      outputRange: [0, -20, 20, -20, 20, 0],
    });

    return (
      <Animated.View
        style={[
          containerDefaultStyle,
          containerStyle,
          {
            transform: [{ translateX: shakeAnimation }],
          },
        ]}
      >
        {pins}
      </Animated.View>
    );
  }

  /**
   * Shakes the pins
   */
  shake() {
    // If vibration is enabled then we vibrate on error
    if (this.props.vibration) {
      Vibration.vibrate(500);
    }

    // Reset animation to so we can reanimate
    this.state.shake.setValue(0);

    // Animate the pins to shake
    Animated.spring(this.state.shake, {
      toValue: 1,
      useNativeDriver: true,
    }).start(() => {
      if (this.props.animationShakeCallback) {
        this.props.animationShakeCallback();
      }
    });
  }

  /**
   * Sets the position of the active pin among the large pins.
   * @param {Number} prevNumberOfPinsActive The index of the previous active pin
   */
  async setPositionOfPins(prevNumberOfPinsActive) {
    const { numberOfPinsMaximum, numberOfPinsActive } = this.props;
    const { positionOfActivePin } = this.state;

    // If index of pin increases
    if (numberOfPinsActive > prevNumberOfPinsActive) {
      // If the position of the pin is not at the right-end, we increase the position of the active pin among the large pins
      if (positionOfActivePin != numberOfPinsMaximum) {
        await this.setState({ positionOfActivePin: positionOfActivePin + 1 });
      }
      // If index of pin decreases
    } else {
      // If the position of the pin is not at the left-end,  we decrease the position of the active pin among the large pins
      if (positionOfActivePin != 1) {
        await this.setState({ positionOfActivePin: positionOfActivePin - 1 });
      }
    }
  }

  /**
   * Updates the sizes of all the pins depending on the number of pins active.
   */
  updatePinSizes() {
    const { currentPinSizes } = this.state;

    let updatedPinSizes = [];

    this.setState({ prevPinSizes: currentPinSizes }, () => {
      currentPinSizes.map((prevSize, idx) => {
        let size = this.getPinSize(idx);
        updatedPinSizes[idx] = size;
      });
    });

    this.setState({ currentPinSizes: updatedPinSizes });
  }

  /**
   * Returns size of an individual pin.
   * @param {number} idx Index of the pin
   */
  getPinSize(idx) {
    const { numberOfPinsMaximum, numberOfPinsActive, pinSize } = this.props;
    const { positionOfActivePin } = this.state;
    if (
      idx > numberOfPinsActive - positionOfActivePin - 1 &&
      idx < numberOfPinsActive - positionOfActivePin + numberOfPinsMaximum
    ) {
      return pinSize;
    }

    if (
      idx == numberOfPinsActive - positionOfActivePin - 1 ||
      idx == numberOfPinsActive - positionOfActivePin + numberOfPinsMaximum
    ) {
      return pinSize / 2;
    }

    if (
      idx == numberOfPinsActive - positionOfActivePin - 2 ||
      idx == numberOfPinsActive - positionOfActivePin + numberOfPinsMaximum + 1
    ) {
      return pinSize / 4;
    }

    return 0;
  }
}

Pins.propTypes = {
  onRef: PropTypes.any,
  numberOfPins: PropTypes.number,
  numberOfPinsActive: PropTypes.number,
  vibration: PropTypes.bool,
  animationShakeCallback: PropTypes.func,
  numberOfPinsMaximum: PropTypes.number,
  activeOnly: PropTypes.bool,
  // Style props
  containerStyle: PropTypes.object,
  pinStyle: PropTypes.object,
  pinActiveStyle: PropTypes.object,
  pinSize: PropTypes.number,
  spacing: PropTypes.number,
};

Pins.defaultProps = {
  // Number of pins to create
  numberOfPins: 5,
  // Active number of pins
  numberOfPinsActive: 0,
  // Is vibration enabled or disabled
  vibration: true,
  // Default pin size
  pinSize: 18,
  // Default spacing between pins
  spacing: 15,
};

export default Pins;

/** -------------------------------------------- */
/**             Component Styling                */
/** -------------------------------------------- */
const styles = StyleSheet.create({
  // Style for pin container. You can use the flex
  // property to expand the pins to take up more space
  // on the screen. The default is 0.8.
  containerDefaultStyle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 25,
    paddingBottom: 25,
  },
  pinDefaultStyle: {
    borderRadius: 9,
    opacity: 0.45,
    backgroundColor: "#FFF",
  },
  pinActiveDefaultStyle: {
    opacity: 1.0,
  },
});
