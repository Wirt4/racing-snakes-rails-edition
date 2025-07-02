# frozen_string_literal: true

require_relative '../../../app/lib/racing_snakes'
RSpec.describe RacingSnakes::Game do
  describe '#game_over?' do
    let(:mock_roster) { instance_double(RacingSnakes::AbstractPlayerRoster, add_player: nil, count: 3, active_players: 3) }
    let(:mock_board) { instance_double(RacingSnakes::AbstractBoard, collisions: nil) }
    let(:game) { described_class.new(player_roster: mock_roster, board: mock_board) }

    it 'its impossible for a game to be over while its still waiting for players' do
      allow(mock_roster).to receive(:count).and_return(0)
      expect(game.game_over?).to be false
    end
    it 'if all but one player is eliminated, the game is over' do
      allow(mock_roster).to receive(:count).and_return(3)
      allow(mock_roster).to receive(:active_players).and_return(1)

      expect(game.game_over?).to be true
    end
  end
end
