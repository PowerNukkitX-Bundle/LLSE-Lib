//@copyright https://github.com/mkhelif/jsassert
//CoolLoong Modify
/**
 * Framework used to simplify JavaScript Unit testing.
 */
import { NbtCompound } from "../../@LiteLoaderLibs/index.js";
import { isEqual } from "../../@LiteLoaderLibs/utils/underscore-esm-min.js";

var JSAssert = JSAssert || (function () {
    /**
     * List of test suites to be excuted.
     */
    var suites = [];

    /**
     * Add a test suite to the tests to be executed.
     */
    var addTestSuite = function (name, suite) {
        suites.push({
            name: name,
            tests: suite
        });
    };

    /**
     * Execute all the JavaScript Unit Tests.
     */
    var execute = function (options) {
        // Merge user settings with default settings
        var settings = {
            onSuiteStarted: function () {
            },
            onSuiteEnded: function () {
            },
            onTestStarted: function () {
            },
            onTestEnded: function () {
            },
            onFinished: function () {
            }
        };
        for (var property in settings) {
            settings[property] = options[property] || settings[property];
        }

        var summary = {
            passed: 0,
            failed: 0,
            duration: 0
        };
        var suiteId = 0;
        for (var index in suites) {
            var suite = suites[index];
            var suiteResult = {
                id: suiteId++,
                name: suite.name,
                passed: 0,
                failed: 0,
                duration: 0
            }

            settings.onSuiteStarted(suiteResult);
            var testId = 0;
            for (var test in suite.tests) {
                var testResult = {
                    id: suiteId + '_' + testId++,
                    name: test,
                    duration: 0,
                    success: true,
                    error: null
                };

                // Execute test and sample time
                settings.onTestStarted(testResult);
                var start = new Date().getTime();
                try {
                    suite.tests[test]();
                    testResult.success = true;
                } catch (error) {
                    testResult.error = error;
                    testResult.success = false;
                }
                var end = new Date().getTime();
                testResult.duration = (end - start);
                settings.onTestEnded(testResult);

                // Update suite result
                if (testResult.success) {
                    suiteResult.passed++;
                } else {
                    suiteResult.failed++;
                }
                suiteResult.duration += testResult.duration;
            }
            settings.onSuiteEnded(suiteResult);

            // Update summary statistics
            summary.passed += suiteResult.passed;
            summary.failed += suiteResult.failed;
            summary.duration += suiteResult.duration;
        }
        settings.onFinished(summary);
    };

    // Expose public facing methods
    return {
        execute: execute,
        addTestSuite: addTestSuite
    };
}());

/**
 * Entry point for assertions.
 */
var assertThat = assertThat || function (object) {
    /**
     * Check the non-nullity of the object.
     * @param message the optionnal message displayed in case of failure.
     */
    var isNotNull = function (message) {
        assertThat(typeof object != 'undefined' && object != null).isTrue(message);
        return this;
    };

    /**
     * Check the nullity of the object.
     * @param message the optionnal message displayed in case of failure.
     */
    var isNull = function (message) {
        assertThat(typeof object == 'undefined' || object == null).isTrue(message);
        return this;
    };

    // Expose public facing methods (common methods)
    var assertions = {};
    switch (typeof object) {
        case "number":
            assertions = numberAssertions;
            break;
        case "boolean":
            assertions = booleanAssertions;
            break;
        case "string":
            assertions = stringAssertions;
            break;
        case "undefined":
            assertions = undefinedAssertions;
            break;
        case "object":
            if (object instanceof Array) {
                assertions = arrayAssertions;
            } else {
                assertions = objectAssertions;
            }
            break;
        case "function": {
            assertions = functionAssertions;
            break;
        }
    }
    if (object instanceof NbtCompound) {
        assertions = NBTAssertions;
    }
    assertions.object = object;
    assertions.isNotNull = isNotNull;
    assertions.isNull = isNull;

    return assertions;
};

/**
 * Assertions available for booleans.
 */
var booleanAssertions = {
    /**
     * Check that the boolean value is true.
     * @param message the optionnal message displayed in case of failure.
     */
    isTrue: function (message) {
        if (this.object != true) {
            throw new Error(message);
        }
        return this;
    },

    /**
     * Check that the boolean value is false.
     * @param message the optionnal message displayed in case of failure.
     */
    isFalse: function (message) {
        assertThat(!this.object).isTrue(message);
        return this;
    },

    /**
     * Check the equality of the boolean.
     * @param expected the expected value.
     * @param message the optionnal message displayed in case of failure.
     */
    equals: function (expected, message) {
        assertThat(this.object === expected).isTrue(message);
        return this;
    }
};

/**
 * Assertions available for numbers.
 */
var numberAssertions = {
    /**
     * Check the equality of the number.
     * @param expected the expected value.
     * @param message the optionnal message displayed in case of failure.
     */
    equals: function (expected, message) {
        assertThat(this.object == expected).isTrue(message);
        return this;
    },

    /**
     * Check that the number is 0.
     * @param message the optionnal message displayed in case of failure.
     */
    isZero: function (message) {
        assertThat(this.object).equals(0, message);
        return this;
    },

    /**
     * Check that the number is not 0.
     * @param message the optionnal message displayed in case of failure.
     */
    isNotZero: function (message) {
        assertThat(this.object != 0).isTrue(message);
        return this;
    },

    /**
     * Check that the number is greater than the value.
     * @param value the value to check the number against.
     * @param message the optionnal message displayed in case of failure.
     */
    isGreaterThan: function (value, message) {
        assertThat(this.object > value).isTrue(message);
        return this;
    },

    /**
     * Check that the number is greater or equals to the value.
     * @param value the value to check the number against.
     * @param message the optionnal message displayed in case of failure.
     */
    isGreaterOrEqualsTo: function (value, message) {
        assertThat(this.object >= value).isTrue(message);
        return this;
    },

    /**
     * Check that the number is lower than the value.
     * @param value the value to check the number against.
     * @param message the optionnal message displayed in case of failure.
     */
    isLowerThan: function (value, message) {
        assertThat(this.object < value).isTrue(message);
        return this;
    },

    /**
     * Check that the number is lower or equals to the value.
     * @param value the value to check the number against.
     * @param message the optionnal message displayed in case of failure.
     */
    isLowerOrEqualsTo: function (value, message) {
        assertThat(this.object <= value).isTrue(message);
        return this;
    }
};

/**
 * Assertions available for strings.
 */
var stringAssertions = {
    /**
     * Retrieve assertions based on string length.
     */
    length: function () {
        return assertThat(this.object.length);
    },

    /**
     * Check the equality of two strings.
     * @param expected the expected string.
     * @param message the optionnal message displayed in case of failure.
     */
    equals: function (expected, message) {
        assertThat(this.object).isNotNull(message);
        assertThat(this.object == expected).isTrue(message);
        return this;
    },

    /**
     * Check that the string contains the value.
     * @param value the value to find in the string.
     * @param message the optionnal message displayed in case of failure.
     */
    contains: function (value, message) {
        assertThat(this.object.indexOf(value) != -1).isTrue(message);
        return this;
    },

    /**
     * Check that the string starts with the value.
     * @param value the value to find in the string.
     * @param message the optionnal message displayed in case of failure.
     */
    startsWith: function (value, message) {
        assertThat(this.object.indexOf(value) == 0).isTrue(message);
        return this;
    },

    /**
     * Check that the string ends with the value.
     * @param value the value to find in the string.
     * @param message the optionnal message displayed in case of failure.
     */
    endsWith: function (value, message) {
        assertThat(this.object.indexOf(value) == this.object.length - value.length).isTrue(message);
        return this;
    },

    /**
     * Check that the string matches the regular expression.
     * @param regexp the regular expression to match.
     * @param message the optionnal message displayed in case of failure.
     */
    matches: function (regexp, message) {
        assertThat(this.object.match(regexp)).isNotNull(message);
        return this;
    }
};

/**
 * Assertions available for objects.
 */
var objectAssertions = {
    /**
     * Check the equality of two objects.
     * @param expected the expected object.
     * @param message the optionnal message displayed in case of failure.
     */
    equals: function (expected, message) {
        assertThat(isEqual(this.object, expected)).isTrue(message);
        return this;
    },

    /**
     * Check the existence of a property in the object.
     * @param property the name of the property to check.
     * @param message the optionnal message displayed in case of failure.
     */
    has: function (property, message) {
        assertThat(this.object).property(property).isNotNull(message);
        return this;
    },

    /**
     * Access to object property assertions.
     * @param property the property to access to.
     */
    property: function (property) {
        return assertThat(this.object[property]);
    }
};

/**
 * Assertions avaialble for Arrays.
 */
var arrayAssertions = {
    /**
     * Retrieve assertions based on array length.
     */
    length: function () {
        return assertThat(this.object.length);
    },

    /**
     * Check the equality of two arrays.
     * @param expected the expected array.
     * @param message the optionnal message displayed in case of failure.
     */
    equals: function (expected, message) {
        assertThat(isEqual(this.object, expected)).isTrue(message);
        return this;
    },

    /**
     * Check that the array contains the element.
     * @param element the element to find in the array.
     * @param message the optionnal message displayed in case of failure.
     */
    contains: function (element, message) {
        assertThat(this.object).isNotNull(message);
        var found = false;
        for (var index in this.object) {
            if (this.object[index] == element) {
                found = true;
                break;
            }
        }
        assertThat(found).isTrue(message);
        return this;
    }
};

/**
 * Assertions available for undefined object.
 */
var undefinedAssertions = {
    /**
     * Check the value of the two objects (undefined).
     * @param expected the expected value.
     * @param message the optionnal message displayed in case of failure.
     */
    equals: function (expected, message) {
        assertThat(this.object == expected).isTrue(message);
        return this;
    }
};

var functionAssertions = {
    /**
     * 不比较函数
     */
    equals: function (expected, message) {
        return this;
    }
}
var NBTAssertions = {
    /**
     * NBT特殊处理
     */
    equals: function (expected, message) {
        let isEqual = this.object._pnxNbt.equals(expected._pnxNbt)
        assertThat(isEqual).isTrue(message);
        return this;
    }
}

export {
    JSAssert,
    assertThat,
    booleanAssertions,
    numberAssertions,
    stringAssertions,
    objectAssertions,
    arrayAssertions,
    undefinedAssertions
}