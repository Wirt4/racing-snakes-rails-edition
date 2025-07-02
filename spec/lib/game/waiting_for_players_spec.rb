# frozen_string_literal: true

require_relative '../../../app/lib/racing_snakes'
RSpec.describe RacingSnakes::Game do
  describe '#waiting_for_players?' do
    let(:mock_board) { instance_double(RacingSnakes::AbstractBoard, collisions: nil) }

    let(:mock_roster) { instance_double(RacingSnakes::AbstractPlayerRoster, add_player: nil, move_players: nil, count: nil) }
    let(:game) { described_class.new(player_roster: mock_roster, board: mock_board) }
    it 'returns true when no players are present' do
      allow(mock_roster).to receive(:count).and_return(0)
      expect(game.waiting_for_players?).to be true
    end
    it 'returns false when at least 2 players are present' do
      allow(mock_roster).to receive(:count).and_return(2)
      expect(game.waiting_for_players?).to be false
    end
  end
end
