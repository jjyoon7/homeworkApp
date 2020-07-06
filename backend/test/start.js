const expect = required('chai').expect

it('decribe the test', function () {
    //code to execute
    const num1 = 2
    const num2 = 3

    expect(num1 * num2).to.equal(6)
})