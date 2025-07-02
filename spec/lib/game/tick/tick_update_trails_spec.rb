# frozen_string_literal: true

require_relative '../../../../app/lib/racing_snakes'

RSpec.describe RacingSnakes::Game do
  let(:mock_roster) do
    instance_double(
      RacingSnakes::AbstractPlayerRoster,
      add_player: nil,
      move_players: nil,
      deactivate: nil,
      count: 2
    )
  end

  let(:mock_board) do
    instance_double(RacingSnakes::AbstractBoard, collisions: nil).tap do |b|
      allow(b).to receive(:update_trails).with(roster: anything)
    end
  end

  let(:game) { described_class.new(player_roster: mock_roster, board: mock_board) }

  describe '#tick' do
    it 'passes player roster to board.collisions' do
      game.tick
      expect(mock_board).to have_received(:update_trails).with(roster: mock_roster)
    end
  end
end
