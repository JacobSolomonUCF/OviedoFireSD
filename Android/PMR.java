package comtelekpsi.github.oviedofireandroid;

import android.content.Context;
import android.support.annotation.IdRes;
import android.text.InputFilter;
import android.text.Selection;
import android.text.SpanWatcher;
import android.text.Spannable;
import android.text.SpannableStringBuilder;
import android.text.Spanned;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.RelativeLayout;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;

import static android.view.View.generateViewId;

/**
 * Created by David on 9/9/2017.
 */

public class PMR {
    String caption;
    String repairString;
    EditText repairEditText;
    RadioButton pRadioButton;
    RadioButton mRadioButton;
    RadioButton rRadioButton;

    public PMR(){
    }
    public PMR(final TableLayout tableLayout, final TableRow tableRow, final TextView textView, final Context context, String caption){
        this.caption=caption;
        textView.setTag("incomplete");
        repairString=null;

        pRadioButton = new RadioButton(context);
        pRadioButton.setText("Present");
        pRadioButton.setId(generateViewId());
        final int pId=pRadioButton.getId();

        mRadioButton = new RadioButton(context);
        mRadioButton.setText("Missing");
        mRadioButton.setId(generateViewId());
        final int mId=mRadioButton.getId();

        rRadioButton = new RadioButton(context);
        rRadioButton.setText("Repairs Needed");
        rRadioButton.setId(generateViewId());
        final int rId=rRadioButton.getId();

        final FancyRadioGroup fancyRadioGroup = new FancyRadioGroup(context, tableRow, textView, pRadioButton, mRadioButton, rRadioButton);

        final LinearLayout textLayout=new LinearLayout(context);
        textLayout.setOrientation(LinearLayout.HORIZONTAL);
        tableLayout.addView(textLayout);
        textLayout.setTag("Text Row");

        final TextView labelText = new TextView(context);
        labelText.setText("");
        textLayout.addView(labelText);

        repairEditText = new EditText(context);
        repairEditText.setEnabled(false);
        repairEditText.setVisibility(View.INVISIBLE);
        repairEditText.setText("");
        textLayout.addView(repairEditText);

        final String prefix="Notes: ";
        pRadioButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mRadioButton.setChecked(false);
                if (repairEditText.isEnabled()){
                    repairEditText.setEnabled(false);
                    repairEditText.setVisibility(View.INVISIBLE);
                    labelText.setText("");
                }
                textView.setTag("Present");
                rRadioButton.setChecked(false);
            }
        });
        mRadioButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                pRadioButton.setChecked(false);
                if (repairEditText.isEnabled()){
                    repairEditText.setEnabled(false);
                    repairEditText.setVisibility(View.INVISIBLE);
                    labelText.setText("");
                }
                textView.setTag("Missing");
                rRadioButton.setChecked(false);
            }
        });
        rRadioButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mRadioButton.setChecked(false);
                pRadioButton.setChecked(false);
                repairEditText.setEnabled(true);
                repairEditText.setVisibility(View.VISIBLE);
                repairEditText.requestFocus();
                labelText.setText(prefix);
                textView.setTag("Repairs Needed");
            }
        });
    }
}
