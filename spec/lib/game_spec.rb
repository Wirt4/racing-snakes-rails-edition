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
  it 'can add a player' do
    game = RacingSnakes::Game.new
    game.add_player('3f9d7c2e1b4a8d65')
  end
end
