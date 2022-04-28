import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  canGemColorBeInsertedIntoSocketColor,
  getBaseWowheadUrl,
  getGemsStats,
} from "../Common";
import { Gems } from "../data/Gems";
import { Items } from "../data/Items";
import i18n from "../i18n/config";
import { setGemsStats, setSelectedGems } from "../redux/PlayerSlice";
import { RootState } from "../redux/Store";
import { favoriteGem, hideGem, setGemSelectionTable } from "../redux/UiSlice";
import {
  Gem,
  InitialGemSelectionTableValue,
  SelectedGemsStruct,
} from "../Types";

export default function GemSelection() {
  const uiState = useSelector((state: RootState) => state.ui);
  const selectedGemsState = useSelector(
    (state: RootState) => state.player.SelectedGems
  );
  const selectedItemsState = useSelector(
    (state: RootState) => state.player.SelectedItems
  );
  const dispatch = useDispatch();
  const [showingHiddenGems, setShowingHiddenGems] = useState(false);
  const { t } = useTranslation();

  function gemClickHandler(gem: Gem) {
    let newSelectedGems: SelectedGemsStruct = JSON.parse(
      JSON.stringify(selectedGemsState)
    );
    let selectedGemsInItemSlot =
      newSelectedGems[uiState.GemSelectionTable.ItemSlot];

    // If the item doesn't have a socket array yet then initialize it to an array of gem IDs 0
    // The first element is the socket color (not gem color) and the second element is the gem id.
    let currentItemGemIds =
      selectedGemsInItemSlot[uiState.GemSelectionTable.ItemId];
    if (!currentItemGemIds) {
      const itemSocketAmount = Items.find(
        (i) => i.Id === parseInt(uiState.GemSelectionTable.ItemId)
      )?.Sockets?.length;
      currentItemGemIds = Array(itemSocketAmount).fill(0);
    } else {
      currentItemGemIds = JSON.parse(JSON.stringify(currentItemGemIds));

      // Return if the clicked gem is the same as the already equipped gem
      if (
        currentItemGemIds[uiState.GemSelectionTable.SocketNumber] === gem.Id
      ) {
        return;
      }
    }

    currentItemGemIds[uiState.GemSelectionTable.SocketNumber] = gem.Id;
    newSelectedGems[uiState.GemSelectionTable.ItemSlot][
      uiState.GemSelectionTable.ItemId
    ] = currentItemGemIds;
    dispatch(setSelectedGems(newSelectedGems));
    dispatch(setGemsStats(getGemsStats(selectedItemsState, newSelectedGems)));
  }

  return (
    <table
      id="gem-selection-table"
      cellSpacing={0}
      data-color="none"
      style={{ display: uiState.GemSelectionTable.Visible ? "" : "none" }}
      onClick={(e) => e.stopPropagation()}
    >
      <tbody>
        <tr>
          <td></td>
          <td
            id="show-hidden-gems-button"
            onClick={() => setShowingHiddenGems(!showingHiddenGems)}
            style={{
              display: uiState.GemPreferences.hidden.length === 0 ? "none" : "",
            }}
          >
            {(showingHiddenGems ? "Hide" : "Show") + " Hidden Gems"}
          </td>
        </tr>
        {Gems.filter(
          (gem) =>
            canGemColorBeInsertedIntoSocketColor(
              uiState.GemSelectionTable.SocketColor,
              gem.Color
            ) && uiState.Sources.some((phase) => phase >= gem.Phase)
        )
          .sort(function (a, b) {
            return (
              Number(uiState.GemPreferences.favorites.includes(b.Id)) -
              Number(uiState.GemPreferences.favorites.includes(a.Id))
            );
          })
          .map((gem) => (
            <tr
              key={gem.Id}
              className="gem-row"
              data-hidden={false}
              style={{
                display:
                  uiState.GemPreferences.hidden.includes(gem.Id) &&
                  !showingHiddenGems
                    ? "none"
                    : "",
              }}
            >
              <td
                className="gem-info gem-favorite-star"
                title={
                  uiState.GemPreferences.favorites.includes(gem.Id)
                    ? "Remove gem from favorites"
                    : "Add gem to favorites"
                }
                data-favorited={uiState.GemPreferences.favorites.includes(
                  gem.Id
                )}
                onClick={() => dispatch(favoriteGem(gem.Id))}
              >
                ★
              </td>
              <td
                className="gem-info gem-name"
                onClick={(e) => {
                  gemClickHandler(gem);
                  dispatch(setGemSelectionTable(InitialGemSelectionTableValue));
                  e.preventDefault();
                }}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/img/${gem.IconName}.jpg`}
                  alt={t(gem.Name)}
                  width={20}
                  height={20}
                />
                <a href={`${getBaseWowheadUrl(i18n.language)}/item=${gem.Id}`}>
                  {t(gem.Name)}
                </a>
              </td>
              <td
                className="gem-info gem-hide"
                title={
                  uiState.GemPreferences.hidden.includes(gem.Id)
                    ? "Show Gem"
                    : "Hide Gem"
                }
                data-hidden={uiState.GemPreferences.hidden.includes(gem.Id)}
                onClick={() => dispatch(hideGem(gem.Id))}
              >
                ❌
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
