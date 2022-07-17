import { Link, List, ListItem, Typography } from '@mui/material'
import { nanoid } from 'nanoid'
import { useDispatch, useSelector } from 'react-redux'
import { GetBaseWowheadUrl } from '../Common'
import { Glyphs } from '../data/Glyphs'
import i18n from '../i18n/config'
import { setGlyphSlotId } from '../redux/PlayerSlice'
import { RootState } from '../redux/Store'
import { setGlyphSelectionTableVisibility } from '../redux/UiSlice'
import { GlyphType } from '../Types'

export default function GlyphTable() {
  const player = useSelector((state: RootState) => state.player)
  const ui = useSelector((state: RootState) => state.ui)
  const dispatch = useDispatch()
  const glyphInSlot = Glyphs.find(
    x =>
      x.Id === player.Glyphs[GlyphType.Major][ui.GlyphSelectionTable.GlyphSlot]
  )

  return (
    <List
      id='glyph-selection-table'
      style={{
        display: ui.GlyphSelectionTable.Visible ? '' : 'none',
        width: '20%',
      }}
    >
      {Glyphs.map(
        glyph =>
          !player.Glyphs[GlyphType.Major].includes(glyph.Id) && (
            <ListItem
              key={nanoid()}
              className='glyph-table-glyph'
              data-checked={glyphInSlot?.Id === glyph.Id}
              onClick={e => {
                dispatch(
                  setGlyphSlotId({
                    slot: ui.GlyphSelectionTable.GlyphSlot,
                    id: glyph.Id,
                  })
                )
                dispatch(setGlyphSelectionTableVisibility(false))
                e.preventDefault()
              }}
            >
              <Link
                style={{ width: '100%' }}
                target='_blank'
                rel='noreferrer'
                href={`${GetBaseWowheadUrl(i18n.language)}/spell=${glyph.Id}`}
              >
                <img
                  width={32}
                  height={32}
                  alt={glyph.Name}
                  src={`${process.env.PUBLIC_URL}/img/${glyph.IconName}.jpg`}
                />
                <Typography
                  style={{ marginLeft: '8px', display: 'inline-block' }}
                >
                  {glyph.Name}
                </Typography>
              </Link>
            </ListItem>
          )
      )}
    </List>
  )
}
