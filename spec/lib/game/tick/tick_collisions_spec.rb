# frozen_string_literal: true

require_relative '../../../../app/lib/racing_snakes'

RSpec.describe RacingSnakes::Game do
  let(:mock_roster) do
    instance_double(
      RacingSnakes::AbstractPlayerRoster,
      add_player: nil,
      count: 2,
      move_players: nil
    ).tap { |r| allow(r).to receive(:deactivate) }
  end

  let(:mock_board) do
    instance_double(RacingSnakes::AbstractBoard, update_trails: nil).tap do |b|
      allow(b).to receive(:collisions).with(roster: anything).and_return([])
    end
  end

  let(:game) { described_class.new(player_roster: mock_roster, board: mock_board) }

  describe '#tick' do
    it 'passes player roster to board.collisions' do
      game.tick
      expect(mock_board).to have_received(:collisions).with(roster: mock_roster)
    end
  end
end
