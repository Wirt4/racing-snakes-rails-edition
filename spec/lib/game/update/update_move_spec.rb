# frozen_string_literal: true

require_relative '../../../../app/lib/racing_snakes'

RSpec.describe RacingSnakes::Game do
  let(:mock_board) { instance_double(RacingSnakes::AbstractBoard, collisions: [], update_trails: nil) }
  let(:mock_roster) { instance_double(RacingSnakes::AbstractPlayerRoster, add_player: nil, move_players: nil, deactivate: nil, count: 2) }
  let(:game) { described_class.new(player_roster: mock_roster, board: mock_board) }

  describe '#tick' do
    it 'calls move on the roster' do
      game.update
      expect(mock_roster).to have_received(:move_players)
    end
  end
end
