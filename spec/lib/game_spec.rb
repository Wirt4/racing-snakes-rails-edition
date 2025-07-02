# frozen_string_literal: true

require_relative '../../app/lib/racing_snakes'

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

RSpec.describe RacingSnakes::Game do
  describe '#tick' do
    let(:active_players) { [instance_double(RacingSnakes::AbstractPlayer), instance_double(RacingSnakes::AbstractPlayer)] }
    let(:mock_roster) do
      instance_double(RacingSnakes::AbstractPlayerRoster, add_player: nil, move_players: nil,
                                                          active_players: active_players).tap do |roster|
        allow(roster).to receive(:deactivate)
      end
    end
    let(:mock_board) do
      instance_double(RacingSnakes::AbstractBoard).tap do |board|
        allow(board).to receive(:collisions).with(active_players: anything).and_return([])
      end
    end
    let(:game) { described_class.new(player_roster: mock_roster, board: mock_board) }
    it 'calls move on the roster' do
      game.tick
      expect(mock_roster).to have_received(:move_players)
    end
    it 'passes player roster to board.collisions' do
      game.tick
      expect(mock_board).to have_received(:collisions).with(active_players: mock_roster.active_players)
    end
    it 'passes the output of collisions to the player roster' do
      allow(mock_board).to receive(:collisions).and_return(['player1'])
      game.tick
      expect(mock_roster).to have_received(:deactivate).with(crashed_players: ['player1'])
    end
  end
end

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
