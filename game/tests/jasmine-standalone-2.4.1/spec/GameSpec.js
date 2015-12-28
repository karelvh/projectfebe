describe("Game", function() {
    var game;
    var id = "tankID";
    var type = 2;
    var isLocal = true;
    var x = 30;
    var y = 30;
    var hp = 100;

    beforeEach(function() {
        game = new Game('#arena', 100, 100, "socketTest");
    });

    it("should be able to add a tank", function() {
        game.addTank(id, type, isLocal, x, y, hp);
        //console.log(game);
        expect(game.localTank.id).toEqual(id);
        //console.log(game.tanks);
    });
});
