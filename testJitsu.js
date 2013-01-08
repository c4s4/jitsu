
function setUp() {
    setUpRun = true;
}

function tearDown() {
    tearDownRun = true;
}

function testSetUp() {
    assertTrue(typeof(setUpRun) == "boolean" && setUpRun);
}

function testTearDown1() {
    if(typeof(testTearDown) == "boolean" && testTearDown) {
        assertTrue(tearDownRun);
    }
    testTearDown = true;
}

function testTearDown2() {
    if(typeof(testTearDown) == "boolean" && testTearDown) {
        assertTrue(tearDownRun);
    }
    testTearDown = true;
}

function testAssertEqual() {
    assertEqual(1, 1);
    assertEqual(1, "1");
    assertEqual("1", 1);
}

function testAssertNotEqual() {
    assertNotEqual(1, 2);
    assertNotEqual(1, "2");
    assertNotEqual("2", 1);
}

function testAssertStrictEqual() {
    assertStrictEqual(1, 1);
}

function testAssertStrictNotEqual() {
    assertStrictNotEqual(1, 2);
    assertStrictNotEqual(1, "1");
}

function testAssertTrue() {
    assertTrue(true);
    assertTrue(1);
    assertTrue("abc");
    assertTrue([1, 2, 3]);
}

function testAssertFalse() {
    assertFalse(false);
    assertFalse(0);
    assertFalse(null);
}

function testAssertRaise() {
    assertRaise(function() {throw "test";}, /test/);
    assertRaise(function() {throw "test";}, /test/, "test");
    assertRaise(function() {assertRaise(function() {var i = 0;}, /./);}, /^No exception was raised$/);
    assertRaise(function() {assertRaise(function() {throw "test";}, /toto/);}, /^Error message doesn't match pattern$/);
    assertRaise(function() {assertRaise(function() {var i = 0;}, /./, "No error");}, /^No error$/);
}

function testSleep() {
    sleep(1000);
}

function sleep(time) {
    d = new Date();
    diff = 0;
    while(diff < time) {
        n = new Date();
        diff = n - d;
    }
}

function testFail() {
    assertRaise(function() {fail("TEST");}, /TEST/);
}
