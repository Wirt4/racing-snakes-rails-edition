require_relative '../../app/lib/racing_snakes'
# describe '#handle_input' do

# it 'updates the player’s steering direction' do
#   game = LightCycleGame.new
#
#   game.add_player("3f9d7c2e1b4a8d65")
#
#   game.handle_input("3f9d7c2e1b4a8d65", :left)
#
#   player = game.players.find { _1.id == 'p1' }
#   expect(player.torque).to eq(-1)
# end
# end

RSpec.describe RacingSnakes::Game do
  describe '#add_player' do
    it 'game has an add_player method' do
      game = RacingSnakes::Game.new
      game.add_player('a2fc0b19dfea4c278379c8d9b79a4f6b')
    end
    it 'the player id must be a string' do
      expect do
        game = RacingSnakes::Game.new
        game.add_player(-1)
      end.to raise_error(ArgumentError, /player_id must be a string/)
    end
  end
end
