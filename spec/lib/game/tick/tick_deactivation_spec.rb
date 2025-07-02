# frozen_string_literal: true

require_relative '../../../../app/lib/racing_snakes'

RSpec.describe RacingSnakes::Game do
  let(:active_players) do
    [instance_double(RacingSnakes::AbstractPlayer), instance_double(RacingSnakes::AbstractPlayer)]
  end

  let(:mock_roster) do
    instance_double(
      RacingSnakes::AbstractPlayerRoster,
      add_player: nil,
      move_players: nil,
      active_players: active_players
    ).tap { |r| allow(r).to receive(:deactivate) }
  end

  let(:mock_board) do
    instance_double(RacingSnakes::AbstractBoard).tap do |b|
      allow(b).to receive(:collisions).with(active_players: anything).and_return(['player1'])
    end
  end

  let(:game) { described_class.new(player_roster: mock_roster, board: mock_board) }

  describe '#tick' do
    it 'passes the output of collisions to the player roster' do
      game.tick
      expect(mock_roster).to have_received(:deactivate).with(crashed_players: ['player1'])
    end
  end
end
