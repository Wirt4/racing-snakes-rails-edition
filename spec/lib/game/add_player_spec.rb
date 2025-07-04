# frozen_string_literal: true

require_relative '../../../app/lib/racing_snakes'

RSpec.describe RacingSnakes::Game do
  describe '#add_player' do
    let(:player_id) { 'a2fc0b19dfea4c278379c8d9b79a4f6b' }
    let(:mock_board) { instance_double(RacingSnakes::AbstractBoard, collisions: nil) }

    let(:mock_roster) { instance_double(RacingSnakes::AbstractPlayerRoster, add_player: nil, move_players: nil, count: 1) }
    let(:game) { described_class.new(player_roster: mock_roster, board: mock_board) }

    it 'passes the player_id to the player roster' do
      game.add_player(player_id)
      expect(mock_roster).to have_received(:add_player).with(player_id)
    end
  end
end
