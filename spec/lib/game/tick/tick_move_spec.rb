# frozen_string_literal: true

require_relative '../../../../app/lib/racing_snakes'

RSpec.describe RacingSnakes::Game do
  let(:active_players) do
    [instance_double(RacingSnakes::AbstractPlayer), instance_double(RacingSnakes::AbstractPlayer)]
  end
  let(:mock_board) do
    instance_double(
      RacingSnakes::AbstractBoard,
      collisions: [],
      update_trails: nil
    )
  end
  let(:mock_roster) do
    instance_double(
      RacingSnakes::AbstractPlayerRoster,
      add_player: nil,
      move_players: nil,
      deactivate: nil,
      count: 2
    )
  end

  let(:game) { described_class.new(player_roster: mock_roster, board: mock_board) }

  describe '#tick' do
    it 'calls move on the roster' do
      game.tick
      expect(mock_roster).to have_received(:move_players)
    end
  end
end
