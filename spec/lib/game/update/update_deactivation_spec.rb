# frozen_string_literal: true

require_relative '../../../../app/lib/racing_snakes'

RSpec.describe RacingSnakes::Game do
  let(:mock_board) do
    instance_double(RacingSnakes::AbstractBoard, collisions: ['player1'], update_trails: nil)
  end
  let(:mock_roster) do
    instance_double(
      RacingSnakes::AbstractPlayerRoster,
      add_player: nil,
      move_players: nil,
      count: 2
    ).tap { |r| allow(r).to receive(:deactivate) }
  end
  let(:game) { described_class.new(player_roster: mock_roster, board: mock_board) }

  describe '#tick' do
    it 'passes the output of collisions to the player roster' do
      game.update
      expect(mock_roster).to have_received(:deactivate).with(crashed_players: ['player1'])
    end
  end
end
